import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useQuizStore } from '@/stores/useQuizStore';

/**
 * 体质自测页
 * 对标 Flutter QuizPage (单题分步模式)
 */
export default function QuizScreen() {
  const router = useRouter();
  const { locale, isZh } = useLocale();
  const {
    questions,
    loadStatus,
    errorMessage,
    currentIndex,
    answers,
    resultStatus,
    loadQuestions,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitAnswers,
    reset,
  } = useQuizStore();

  useEffect(() => {
    reset();
    loadQuestions();
  }, [locale]);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id] != null);

  // After submit, navigate to result
  useEffect(() => {
    if (resultStatus === 'success') {
      router.push('/quiz-result');
    }
  }, [resultStatus, router]);

  return (
    <BasePage
      loading={loadStatus === 'idle' || loadStatus === 'loading'}
      error={loadStatus === 'error' ? errorMessage : null}
      onRetry={loadQuestions}
    >
      {question && (
        <View style={styles.content}>
          {/* Instruction */}
          <Text style={styles.intro}>
            {isZh
              ? '请根据最近两周的状态完成体质自测。'
              : 'Answer the questionnaire based on your recent two weeks.'}
          </Text>

          {/* Progress */}
          <Text style={styles.progress}>
            {currentIndex + 1} / {questions.length}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                },
              ]}
            />
          </View>

          {/* Question */}
          <Text style={styles.question}>{question.question}</Text>

          {/* Options */}
          <View style={styles.options}>
            {question.options.map((opt, i) => {
              const selected = answers[question.id] === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => selectAnswer(question.id, i)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit error */}
          {resultStatus === 'error' && errorMessage ? (
            <Text style={styles.submitError}>{errorMessage}</Text>
          ) : null}

          {/* Navigation */}
          <View style={styles.nav}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.navBtn} onPress={prevQuestion}>
                <Text style={styles.navBtnText}>
                  {isZh ? '上一题' : 'Previous'}
                </Text>
              </TouchableOpacity>
            )}

            {isLast ? (
              <TouchableOpacity
                style={[styles.navBtn, styles.submitBtn, !allAnswered && styles.btnDisabled]}
                onPress={submitAnswers}
                disabled={!allAnswered}
              >
                <Text style={styles.submitText}>
                  {resultStatus === 'loading'
                    ? (isZh ? '提交中...' : 'Submitting...')
                    : (isZh ? '查看结果' : 'View Result')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, styles.nextBtn]}
                onPress={nextQuestion}
              >
                <Text style={styles.nextText}>
                  {isZh ? '下一题' : 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerWrap}>
            <DisclaimerCard text="本内容仅为养生科普，不替代医疗诊断与治疗方案" />
          </View>
        </View>
      )}
    </BasePage>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.lg },
  intro: {
    ...Typography.bodyLarge,
    color: Colors.body,
    marginBottom: Spacing.xl,
    lineHeight: 23,
  },
  progress: { ...Typography.bodySmall, color: Colors.body, marginBottom: Spacing.sm },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: Spacing.xxl,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  question: {
    ...Typography.headlineSmall,
    marginBottom: Spacing.xxl,
  },
  options: { gap: Spacing.md, marginBottom: Spacing.xl },
  option: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '14',
  },
  optionText: { ...Typography.bodyLarge },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  submitError: {
    ...Typography.bodySmall,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  navBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBtnText: { ...Typography.titleMedium, color: Colors.secondary },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  submitText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
  nextText: { color: Colors.surface, fontWeight: '700', fontSize: 16 },
  btnDisabled: { opacity: 0.5 },
  disclaimerWrap: {
    marginTop: Spacing.xxl,
  },
});
