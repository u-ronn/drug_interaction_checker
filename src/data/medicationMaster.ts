import { MedicationMaster } from '../types';

// サンプル医薬品マスターデータ（サジェスト用）
export const medicationMaster: MedicationMaster[] = [
  // 処方薬
  { name: 'ワーファリン', type: 'prescription' },
  { name: 'アスピリン', type: 'prescription' },
  { name: 'リピトール', type: 'prescription' },
  { name: 'ロキソニン', type: 'prescription' },
  { name: 'メイアクト', type: 'prescription' },
  { name: 'プラビックス', type: 'prescription' },
  { name: 'タケプロン', type: 'prescription' },
  { name: 'リリカ', type: 'prescription' },
  { name: 'セレコックス', type: 'prescription' },
  { name: 'バイアスピリン', type: 'prescription' },
  { name: 'ジャヌビア', type: 'prescription' },
  { name: 'アマリール', type: 'prescription' },
  { name: 'ノルバスク', type: 'prescription' },
  { name: 'ブロプレス', type: 'prescription' },
  { name: 'デパス', type: 'prescription' },
  
  // 市販薬
  { name: 'バファリンA', type: 'otc' },
  { name: 'イブプロフェン', type: 'otc' },
  { name: 'パブロンゴールド', type: 'otc' },
  { name: 'ガスター10', type: 'otc' },
  { name: 'アレグラFX', type: 'otc' },
  { name: 'タイレノールA', type: 'otc' },
  { name: 'ビオフェルミン', type: 'otc' },
  
  // サプリメント
  { name: 'セントジョーンズワート', type: 'supplement', ingredient: 'セントジョーンズワート' },
  { name: 'ビタミンK', type: 'supplement', ingredient: 'ビタミンK' },
  { name: 'オメガ3', type: 'supplement', ingredient: 'オメガ3脂肪酸' },
  { name: 'グレープフルーツジュース', type: 'supplement', ingredient: 'グレープフルーツ' },
  { name: 'イチョウ葉エキス', type: 'supplement', ingredient: 'イチョウ葉' },
  { name: 'マルチビタミン', type: 'supplement', ingredient: 'ビタミン複合' },
  { name: 'カルシウムサプリ', type: 'supplement', ingredient: 'カルシウム' },
  { name: '鉄分サプリ', type: 'supplement', ingredient: '鉄' },
];
