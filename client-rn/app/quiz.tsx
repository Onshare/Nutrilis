import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BasePage } from '@/components/BasePage';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useQuizStore } from '@/stores/useQuizStore';

/**
 * 体质自测页
 * 对标 Flutter QuizPage
 */
export default function QuizScreen() {
  const router = useRouter();
  const { locale } = useLocale();
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

          {/* Navigation */}
          <View style={styles.nav}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.navBtn} onPress={prevQuestion}>
                <Text style={styles.navBtnText}>上一题</Text>
              </TouchableOpacity>
            )}

            {isLast ? (
              <TouchableOpacity
                style={[styles.navBtn, styles.submitBtn, !allAnswered && styles.btnDisabled]}
                onPress={submitAnswers}
                disabled={!allAnswered}
              >
                <Text style={styles.submitText}>
                  {resultStatus === 'loading' ? '提交中...' : '提交测评'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, styles.nextBtn]}
                onPress={nextQuestion}
              >
                <Text style={styles.nextText}>下一题</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </BasePage>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.lg },
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
  options: { gap: Spacing.md, marginBottom: Spacing.xxl },
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
});
