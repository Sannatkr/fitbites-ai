import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_APP_OPENAI_KEY,
});

export async function analyzeFood(base64Image) {
  try {
    const base64Data = base64Image.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );

    const maxSizeInBytes = 20971520;
    console.log("size", base64Data.length);
    // if (base64Data.length * 0.75 > maxSizeInBytes) {
    //   throw new Error("Image size too large");
    // }

    // const newLocal = "json";
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      // response_format: { typnewLocalon" }, // ✅ Correct
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the food image and return ONLY a JSON array with nutritional values in this exact format:
              [
                  {"calories": "Total estimated calories (in kcal)"},
                  {"protein": "Total estimated protein range (in grams)"},
                  {"carbohydrates": "Total estimated carbohydrate range (in grams)"},
                  {"fats": "Saturated (in g), Unsaturated (in g), Trans (in g)"},
                  {"fiber": "Total estimated fiber range (in grams)"},
                  {"sugar": "Total estimated sugar range (in grams)"},
                  {"vitamins": "A (in mcg), C (in mg), D (in mcg), E (in mg)"},
                  {"minerals": "Calcium (in mg), Phosphorus (in mg), Iron (in mg), Zinc (in mcg), Magnesium (in mg), Sodium (in mg)"},
                  {"diet compatibility": "Examples: Vegan, Low-fat, High-protein, etc."},
                  {"summary": "Create a detailed 1000-character report summary that includes the food name, its country or region of origin, and a comprehensive breakdown of all key nutritional estimated values (macronutrients, micronutrients, fiber, sugar, etc.) to assist doctors and dieticians in analyzing its health benefits, risks, and relevance for fitness or medical purposes in a clear and professional manner."}
              ]
              Reference Portion Sizes:
              - Flatbread/Tortilla: 1 piece (50-70g per piece)
              - Cooked Grains (e.g., rice, quinoa): 1 cup (150-200g per cup)
              - Cooked Legumes/Soups (e.g., lentils, chickpeas): 1 bowl (150-250g per bowl)
              - Roasted/Stir-Fried Vegetables: 1 cup (80-120g per cup)
              - Fresh Vegetables (Raw Salad): 1 bowl (100-150g per bowl)
              - Fruit: 1 medium-sized piece or 1 cup (100-150g per serving)
              - Small Dessert (e.g., pastry, cookie): 1 piece (30-60g per piece)
              - Dairy Serving (e.g., milk, yogurt): 1 cup (100-150g per cup)
              - Cheese: 1 slice or cube (20-30g per slice)
              - Beverage (e.g., tea, juice): 1 cup (200-300g per cup)
              - Nuts and Seeds: 1 handful (20-30g per serving)
              - Meat/Fish/Poultry: 1 portion (100-150g per serving)
              - Egg: 1 large egg (50g per egg)
              - Oil/Butter: 1 teaspoon (5g per teaspoon)
              
              Example of Response:
              [
                  {"calories": "450 kcal"},
                  {"protein": "25-30g"},
                  {"carbohydrates": "50-60g"},
                  {"fats": "Saturated: 8g, Unsaturated: 12g, Trans: 0g"},
                  {"fiber": "8-10g"},
                  {"sugar": "12-15g"},
                  {"vitamins": "A: 600mcg, C: 20mg, D: 2.5mcg, E: 4mg"},
                  {"minerals": "Calcium: 300mg, Phosphorus: 400mg, Iron: 5mg, Zinc: 800mcg, Magnesium: 120mg, Sodium: 650mg"},
                  {"diet compatibility": "Balanced, Moderate-carb, High-protein"},
                  {"summary": "This meal appears to be a grilled chicken breast, brown rice, roasted vegetables, and a small side salad. The dish provides a well-balanced combination of macronutrients, with a moderate amount of complex carbohydrates from the rice (50-60g), a good source of lean protein from the chicken (25-30g), and healthy fats from the vegetables and dressing (20g total). The meal is rich in dietary fiber (8-10g) from the whole grains and vegetables, supporting digestive health. Key micronutrients include vitamin A from the yellow and green vegetables, vitamin C from the salad, and minerals like calcium, iron, and zinc that are important for bone health, oxygen transport, and immune function. The sodium content is moderate at 650mg. This meal would be suitable for those looking to maintain a balanced diet focused on whole, nutrient-dense foods. It provides sustained energy and supports muscle recovery, making it appropriate for both fitness and general health goals."}
              ]
              Strict Notes:
              - Use standard nutritional averages for calculations
              - Always include units for all nutritional values
              - Estimates must be realistic and based on visible portion sizes, dont exaggerate, strictly for protien, carbohydrates and calories, try ko keep it minimal like dietician expert.
              - Return ONLY the final nutrition JSON array in response
              - Keep the array length exactly 10 items
              - Use the exact format shown above`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Data}`,
              },
            },
          ],
        },
      ],
    });

    const rawContent = response.choices[0].message.content;
    console.log(rawContent);
    const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Throw specific error for food image parsing
      const error = new Error("No valid food data found");
      error.code = "FOOD_ANALYSIS_ERROR";
      throw error;
    }
    const nutritionData = JSON.parse(jsonMatch[0]);
    return nutritionData;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    // Add custom error code
    error.code = error.code || "FOOD_ANALYSIS_ERROR";
    throw error;
  }
}

export async function analyzeMealSummary(summary) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Expert Dietician Meal Analysis Task
                    Objective: Provide a structured, concise analysis of a meal summary focusing on three key aspects.
                    Input Format: Detailed meal description or summary
                    Output Format: Strictly an array of 3 strings [improvementSuggestion, specialConsiderations, frequencyRecommendation]
                    Analysis Guidelines:
                    - Improvement Suggestions: Practical, fitness-friendly nutritional enhancements
                    - Special Considerations: Highlight allergens, unique health impacts
                    - Frequency Recommendation: Suggest consumption frequency based on fitness goals
                    Example Input: "Breakfast of two scrambled eggs, whole wheat toast with avocado spread, and a small orange juice"
                    Example Output: [
                      "Add spinach to eggs for extra nutrients and fiber boost",
                      "Contains eggs - potential allergen, high in cholesterol",
                      "Safe for weekly consumption, balanced morning meal"
                    ]
                    Meal Summary to Analyze: ${summary}
                    Strict Requirements:
                    - Response MUST be a JSON array with exactly 3 strings
                    - Each string: 15-18 words max
                    - Use clear, accessible English
                    - Focus on realistic, health-conscious insights
                    - No additional text or explanation beyond the array
                    `,
        },
      ],
    });

    const rawContent = response.choices[0].message.content;

    // Enhanced parsing to handle potential variations
    const parseResponse = (content) => {
      try {
        // Try direct JSON parsing first
        return JSON.parse(content);
      } catch (jsonError) {
        // If direct parsing fails, try extracting array using regex
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No valid JSON array found in the response");
      }
    };

    const analysis = parseResponse(rawContent);

    // Validate the returned array
    if (
      !Array.isArray(analysis) ||
      analysis.length !== 3 ||
      !analysis.every((item) => typeof item === "string")
    ) {
      const error = new Error("Invalid meal analysis format");
      error.code = "MEAL_ANALYSIS_ERROR";
      throw error;
    }

    return analysis;
  } catch (error) {
    console.error("Error analyzing meal summary:", error);
    // Add custom error code
    error.code = error.code || "MEAL_ANALYSIS_ERROR";
    throw error;
  }
}
