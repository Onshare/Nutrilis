package com.nutrilis.server.content.data

import com.nutrilis.server.content.domain.LocalizedValue
import com.nutrilis.server.content.entity.SeedDailyCareEntity
import com.nutrilis.server.content.entity.SeedQuizQuestionEntity
import com.nutrilis.server.content.entity.SeedRecipeEntity
import com.nutrilis.server.content.entity.SeedTherapyEntity
import org.springframework.stereotype.Repository

@Repository
class SeedContentRepository {
    val disclaimer = LocalizedValue(
        zh = "本内容仅为养生科普，不替代医疗诊断与治疗方案",
        en = "This content is for wellness education only and does not replace medical diagnosis or treatment.",
    )

    private val recipes = listOf(
        SeedRecipeEntity(
            id = "recipe-lily",
            title = LocalizedValue("百合马蹄羹", "Lily Bulb Water Chestnut Soup"),
            summary = LocalizedValue("春季润燥、清润轻补。", "A light spring recipe for dryness relief."),
            effect = LocalizedValue("润肺养阴、清热生津。", "Moisturizes the lungs and supports yin."),
            suitableFor = LocalizedValue("平和质、阴虚倾向人群。", "Balanced or mildly yin-deficient constitutions."),
            contraindications = LocalizedValue("脾胃虚寒、腹泻频繁者谨慎。", "Use with caution if you often have cold digestion or diarrhea."),
            source = LocalizedValue("权威来源：中医食养科普整理", "Source: TCM dietary education editorial"),
            tags = listOf(
                LocalizedValue("春季", "Spring"),
                LocalizedValue("润燥", "Moisturizing"),
                LocalizedValue("低负担", "Light"),
            ),
            ingredients = listOf("鲜百合 100g", "马蹄 6-8 个", "枸杞 10g", "老冰糖 适量"),
            steps = listOf(
                LocalizedValue("百合洗净掰瓣，马蹄切薄片。", "Prepare lily bulbs and slice the water chestnuts."),
                LocalizedValue("清水煮沸后先下百合，小火慢煮。", "Boil water and simmer the lily bulbs first."),
                LocalizedValue("加入马蹄和枸杞，再煮数分钟。", "Add chestnuts and goji berries and simmer a little longer."),
            ),
        ),
        SeedRecipeEntity(
            id = "recipe-angelica",
            title = LocalizedValue("当归补血汤", "Angelica Blood Nourishing Soup"),
            summary = LocalizedValue("温和补气养血。", "A gentle recipe to support qi and blood."),
            effect = LocalizedValue("补气养血、温润调中。", "Supports qi and blood with a warming effect."),
            suitableFor = LocalizedValue("气血不足倾向人群。", "Suitable for mild qi and blood deficiency patterns."),
            contraindications = LocalizedValue("感冒发热时不建议食用。", "Avoid during fever or acute illness."),
            source = LocalizedValue("权威来源：经典食养整理", "Source: Classical dietary wellness references"),
            tags = listOf(
                LocalizedValue("补气血", "Qi & Blood"),
                LocalizedValue("温润", "Warming"),
            ),
            ingredients = listOf("当归 10g", "黄芪 20g", "红枣 6 枚", "瘦肉 200g"),
            steps = listOf(
                LocalizedValue("药材浸泡，瘦肉焯水。", "Soak the herbs and blanch the meat."),
                LocalizedValue("全部食材小火炖煮 60 分钟。", "Simmer all ingredients for 60 minutes."),
            ),
        ),
    )

    private val therapies = listOf(
        SeedTherapyEntity(
            id = "therapy-hegu",
            title = LocalizedValue("合谷穴：春季排毒按摩", "Hegu Acupressure for Spring Relief"),
            category = LocalizedValue("推拿", "Acupressure"),
            principle = LocalizedValue("通过轻量刺激帮助改善局部循环与紧张感。", "Uses gentle stimulation to support circulation and relief."),
            suitableFor = LocalizedValue("久坐、视疲劳、春季易上火人群。", "Helpful for sedentary users and spring heat discomfort."),
            contraindications = LocalizedValue("孕妇禁用，局部炎症或伤口需暂停。", "Avoid during pregnancy or if the area is inflamed."),
            notes = LocalizedValue("每次 3-5 分钟，酸胀但可耐受为宜。", "Apply moderate pressure for 3-5 minutes."),
            source = LocalizedValue("权威来源：穴位保健科普", "Source: Acupressure wellness editorial"),
        ),
        SeedTherapyEntity(
            id = "therapy-moxa",
            title = LocalizedValue("艾灸调理：脾胃温养", "Moxibustion for Warming the Spleen & Stomach"),
            category = LocalizedValue("艾灸", "Moxibustion"),
            principle = LocalizedValue("借助温热刺激扶阳散寒。", "Uses warmth to support yang and ease cold patterns."),
            suitableFor = LocalizedValue("阳虚倾向、畏寒人群。", "Suitable for users who often feel cold."),
            contraindications = LocalizedValue("发热、孕期及皮肤敏感人群需谨慎。", "Use cautiously during fever, pregnancy, or sensitive skin conditions."),
            notes = LocalizedValue("每次 10-15 分钟，保持通风，注意安全。", "Keep sessions to 10-15 minutes with good ventilation."),
            source = LocalizedValue("权威来源：传统理疗科普", "Source: Traditional therapy education"),
        ),
    )

    private val dailyCareTopics = listOf(
        SeedDailyCareEntity("routine", LocalizedValue("起居节律", "Daily Rhythm"), LocalizedValue("围绕作息、饮水与午后活动建立稳定节律。", "Build a stable routine around sleep, hydration, and gentle activity.")),
        SeedDailyCareEntity("acupressure", LocalizedValue("穴位按摩", "Acupressure"), LocalizedValue("通过轻量手法缓解久坐带来的肩颈负担。", "Relieve neck and shoulder strain from sedentary work.")),
        SeedDailyCareEntity("mood", LocalizedValue("情志调理", "Mind Balance"), LocalizedValue("借助呼吸、步行与留白时间稳定情绪。", "Use breathing and walking to stabilize mood.")),
        SeedDailyCareEntity("season", LocalizedValue("四季养生", "Seasonal Care"), LocalizedValue("根据节气调整衣着、饮食和作息。", "Adjust clothing, diet, and routines by season.")),
    )

    private val quizQuestions = listOf(
        SeedQuizQuestionEntity("q1", LocalizedValue("你最近是否经常手脚发凉？", "Do your hands and feet often feel cold lately?"), listOf(LocalizedValue("从不", "Never"), LocalizedValue("偶尔", "Occasionally"), LocalizedValue("经常", "Often"))),
        SeedQuizQuestionEntity("q2", LocalizedValue("你是否容易口干、想喝水？", "Do you often feel dry or thirsty?"), listOf(LocalizedValue("很少", "Rarely"), LocalizedValue("有时", "Sometimes"), LocalizedValue("明显", "Frequently"))),
        SeedQuizQuestionEntity("q3", LocalizedValue("是否容易疲劳、懒言少气？", "Do you tire easily or feel low on energy?"), listOf(LocalizedValue("没有", "No"), LocalizedValue("轻微", "Mildly"), LocalizedValue("明显", "Clearly"))),
        SeedQuizQuestionEntity("q4", LocalizedValue("你的睡眠质量近期如何？", "How has your sleep quality been recently?"), listOf(LocalizedValue("很好", "Great"), LocalizedValue("一般", "Average"), LocalizedValue("较差", "Poor"))),
    )

    fun recipes(): List<SeedRecipeEntity> = recipes

    fun recipe(id: String): SeedRecipeEntity = recipes.first { it.id == id }

    fun therapies(): List<SeedTherapyEntity> = therapies

    fun therapy(id: String): SeedTherapyEntity = therapies.first { it.id == id }

    fun dailyCare(): List<SeedDailyCareEntity> = dailyCareTopics

    fun quizQuestions(): List<SeedQuizQuestionEntity> = quizQuestions
}
