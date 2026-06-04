/** 问卷题目 VO */
export interface QuizQuestionVO {
  id: string;
  question: string;
  options: string[];
}

/** 问卷结果 VO */
export interface QuizResultVO {
  result: string;
  advice: string;
  disclaimer: string;
}
