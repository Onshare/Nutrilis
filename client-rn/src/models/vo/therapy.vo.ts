/** 理疗摘要 VO (列表页) */
export interface TherapySummaryVO {
  id: string;
  title: string;
  category: string;
  summary: string;
  source: string;
  isFavorited: boolean;
}

/** 理疗详情 VO */
export interface TherapyDetailVO {
  id: string;
  title: string;
  category: string;
  principle: string;
  suitableFor: string;
  contraindications: string;
  notes: string;
  source: string;
  disclaimer: string;
  isFavorited: boolean;
}
