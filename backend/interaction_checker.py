from models import Medication, InteractionCheckResult, InteractionData, RiskLevel

# リスクレベルの優先度（高いほど重要）
RISK_LEVEL_PRIORITY = {
    'severe': 3,
    'moderate': 2,
    'mild': 1,
    'none': 0,
}

# リスクレベルごとの表示テキスト（A欄要件に基づく）
RISK_LEVEL_DISPLAY = {
    'severe': {
        'text': '【最重要】深刻な相互作用の可能性があります。専門家への相談を強く推奨します。',
        'color': 'red',
        'icon': '🔴',
    },
    'moderate': {
        'text': '【要注意】中程度の相互作用の懸念があります。専門家にご相談ください。',
        'color': 'yellow',
        'icon': '🟡',
    },
    'mild': {
        'text': '【軽度懸念】相互作用の報告があります。',
        'color': 'blue',
        'icon': '🔵',
    },
    'none': {
        'text': '【現状データでは】特段の記載はありません。',
        'color': 'green',
        'icon': '🟢',
    },
}


def check_interactions(medications: list[Medication]) -> InteractionCheckResult:
    """
    薬剤の相互作用をチェック（ORCA API使用）
    
    処理フロー:
    1. ORCA API サービスを使って全薬剤の組み合わせをチェック
    2. マスターデータとの照合結果を取得
    3. 最も高いリスクレベルと全ての相互作用を返す
    
    Returns:
        InteractionCheckResult: リスクレベル、表示テキスト、相互作用リスト
    """
    found_interactions = []
    
    # ORCA API サービスを使って相互作用をチェック
    from orca_service import OrcaApiService
    orca_service = OrcaApiService()
    
    try:
        found_interactions = orca_service.check_interactions(medications)
    except Exception as e:
        # ORCA API でエラーが発生した場合は空のリストを返す
        # 実運用では適切なエラーハンドリング（ログ記録、アラート等）が必要
        import logging
        logging.getLogger(__name__).error(f"ORCA API 呼び出しエラー: {e}")
        found_interactions = []
    
    # Determine highest risk level
    highest_risk: RiskLevel = 'none'
    if found_interactions:
        highest_risk = max(
            (inter.riskLevel for inter in found_interactions),
            key=lambda level: RISK_LEVEL_PRIORITY[level]
        )
    
    # Get display information
    display = RISK_LEVEL_DISPLAY[highest_risk]
    
    return InteractionCheckResult(
        riskLevel=highest_risk,
        displayText=display['text'],
        color=display['color'],
        icon=display['icon'],
        interactions=found_interactions,
    )
