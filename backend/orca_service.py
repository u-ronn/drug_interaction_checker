import os
import logging
import requests
import xml.etree.ElementTree as ET
from typing import List, Optional
from models import Medication, InteractionData, RiskLevel

logger = logging.getLogger(__name__)

class OrcaApiService:
    def __init__(self):
        # Default to a placeholder URL. In production, this must be set.
        self.api_url = os.getenv("ORCA_API_URL", "http://localhost:8000/api01/rv2/interaction_check")
        self.user = os.getenv("ORCA_USER", "ormaster")
        self.password = os.getenv("ORCA_PASSWORD", "password")
        # Dummy Patient ID for stateless/generic checks
        self.dummy_patient_id = os.getenv("DUMMY_PATIENT_ID", "99999999")

    def check_interactions(self, medications: List[Medication]) -> List[InteractionData]:
        """
        Check interactions using ORCA API.
        
        Strategy:
        - Use a dummy patient ID.
        - Send all medications in the 'Medical Information' block.
        - Parse the response for contraindications.
        """
        if not medications:
            return []

        try:
            # 1. Construct Request XML
            request_xml = self._build_request_xml(medications)
            
            # 2. Call API
            # In a real scenario, we would post this XML to the ORCA server.
            # For now, if the URL is localhost and not running, this might fail.
            # We'll wrap it in a try/except and maybe return a mock response if configured,
            # but strictly we should try to call it.
            
            # headers = {'Content-Type': 'application/xml'}
            # response = requests.post(
            #     self.api_url, 
            #     data=request_xml, 
            #     auth=(self.user, self.password),
            #     headers=headers,
            #     timeout=10
            # )
            # response.raise_for_status()
            # response_content = response.content
            
            # MOCKING for development since we don't have a live ORCA server:
            # If ORCA_MOCK_MODE is true, return a fake response based on input.
            if os.getenv("ORCA_MOCK_MODE", "true").lower() == "true":
                response_content = self._generate_mock_response(medications)
            else:
                # Real call implementation (commented out above, enabled here)
                headers = {'Content-Type': 'application/xml'}
                response = requests.post(
                    self.api_url, 
                    data=request_xml, 
                    auth=(self.user, self.password),
                    headers=headers,
                    timeout=10
                )
                response.raise_for_status()
                response_content = response.content

            # 3. Parse Response
            return self._parse_response(response_content)

        except Exception as e:
            logger.error(f"ORCA API Error: {str(e)}")
            # In a production app, we might want to raise this or return a specific error.
            # For now, return empty list or raise.
            raise e

    def _build_request_xml(self, medications: List[Medication]) -> str:
        """
        ORCA APIリクエストXML (ORAPI021R4V2) を構築
        
        方法A: 全ての薬剤を Medical Information に含めて、
        ORCA マスターデータのみに基づく相互作用チェックを実施
        """
        root = ET.Element("Request")
        
        # ダミー患者IDでリクエスト（患者を特定しない汎用チェック）
        patient_info = ET.SubElement(root, "Patient_Information")
        ET.SubElement(patient_info, "Patient_ID").text = self.dummy_patient_id
        
        # 医療情報（全ての薬剤を登録）
        medical_info = ET.SubElement(root, "Medical_Information")
        
        for med in medications:
            drug_info = ET.SubElement(medical_info, "Drug_Information")
            # 薬剤名で検索（理想的にはYJコード等を使用するが、現状は名前のみ）
            ET.SubElement(drug_info, "Drug_Name").text = med.name
            # 将来的な拡張: YJコード対応
            # if med.code:
            #     ET.SubElement(drug_info, "Drug_Code").text = med.code
        
        return ET.tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    def _parse_response(self, xml_content: bytes) -> List[InteractionData]:
        """
        ORCA APIレスポンスXMLをパース
        
        抽出項目:
        - Contra Name: 相互作用がある薬剤名 (Drug_Name_B)
        - Symptom Content: 具体的なリスク内容
        - Symptom Detail: 作用機序・詳細情報
        - Context Class: 相互作用の分類（併用禁忌/併用注意）
        """
        interactions = []
        try:
            root = ET.fromstring(xml_content)
            
            # レスポンス構造（想定）:
            # <Response>
            #   <Interaction_Result>
            #     <Interaction>
            #       <Drug_Name_A>...</Drug_Name_A>
            #       <Drug_Name_B>...</Drug_Name_B> (Contra Name)
            #       <Symptom_Content>...</Symptom_Content>
            #       <Symptom_Detail>...</Symptom_Detail>
            #       <Context_Class>...</Context_Class>
            #     </Interaction>
            #   </Interaction_Result>
            # </Response>
            
            for interaction_node in root.findall(".//Interaction"):
                drug_a = interaction_node.findtext("Drug_Name_A", "")
                drug_b = interaction_node.findtext("Drug_Name_B", "")  # Contra Name
                symptom = interaction_node.findtext("Symptom_Content", "相互作用の可能性があります")
                detail = interaction_node.findtext("Symptom_Detail", "")
                context_class = interaction_node.findtext("Context_Class", "")
                
                # リスクレベルの判定（Context_Class を優先的に使用）
                risk_level: RiskLevel = "moderate"
                
                # 併用禁忌の検出（最高リスク）
                if "併用禁忌" in context_class or "禁忌" in symptom:
                    risk_level = "severe"
                    logger.warning(f"併用禁忌検出: {drug_a} × {drug_b}")
                # 併用注意の検出（中程度リスク）
                elif "併用注意" in context_class or "注意" in symptom or "注意" in context_class:
                    risk_level = "moderate"
                    logger.info(f"併用注意検出: {drug_a} × {drug_b}")
                # その他（軽度リスク）
                else:
                    risk_level = "mild"
                
                interactions.append(InteractionData(
                    drug1=drug_a,
                    drug2=drug_b,
                    riskLevel=risk_level,
                    concerns=symptom,      # Symptom Content → 懸念される事象
                    mechanism=detail,      # Symptom Detail → 作用機序
                    source="ORCA (Japan Medical Association)"
                ))
                
                logger.info(f"相互作用を記録: {drug_a} × {drug_b} (リスク: {risk_level})")
                
        except ET.ParseError as e:
            logger.error(f"ORCA XMLレスポンスのパースに失敗: {e}")
        except Exception as e:
            logger.error(f"レスポンス処理中の予期しないエラー: {e}")
            
        return interactions

    def _generate_mock_response(self, medications: List[Medication]) -> bytes:
        """
        Generates a mock XML response for testing without a real server.
        """
        root = ET.Element("Response")
        result_node = ET.SubElement(root, "Interaction_Result")
        
        names = [m.name for m in medications]
        
        # Simple mock logic: if "Warfarin" and "Aspirin" are present, return interaction.
        # Also check for Japanese names if used in the app.
        # "ワーファリン" (Warfarin) and "ロキソニン" (Loxoprofen) or "アスピリン"
        
        has_warfarin = any("ワーファリン" in n or "Warfarin" in n for n in names)
        has_nsaid = any("ロキソニン" in n or "アスピリン" in n or "Loxoprofen" in n for n in names)
        
        if has_warfarin and has_nsaid:
            inter = ET.SubElement(result_node, "Interaction")
            ET.SubElement(inter, "Drug_Name_A").text = "ワーファリン"
            ET.SubElement(inter, "Drug_Name_B").text = "ロキソニン"
            ET.SubElement(inter, "Symptom_Content").text = "出血傾向が増強されるおそれがある。"
            ET.SubElement(inter, "Symptom_Detail").text = "抗血小板作用により、ワーファリンの抗凝固作用が増強される。"
            ET.SubElement(inter, "Context_Class").text = "併用注意"
            
        return ET.tostring(root, encoding='utf-8', method='xml')
