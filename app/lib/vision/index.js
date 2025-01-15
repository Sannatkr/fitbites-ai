import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeFood(base64Image) {
  try {
    const base64Data = base64Image.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                  Step 1: Extract Meal Data
                  - Identify all visible food items
                  - Format as JSON array:
                  [
                    {
                      "label": "food_name_in_english",
                      "quantity": weight_in_grams,
                      "unit": "gram"
                    }
                  ]

                  Reference portions:
                  Flatbread/Tortilla: 1 piece (50-70g per piece)
                  Cooked Grains (e.g., rice, quinoa): 1 cup (150-200g per cup)
                  Cooked Legumes/Soups (e.g., lentils, chickpeas): 1 bowl (150-250g per bowl)
                  Roasted/Stir-Fried Vegetables: 1 cup (80-120g per cup)
                  Fresh Vegetables (Raw Salad): 1 bowl (100-150g per bowl)
                  Fruit: 1 medium-sized piece or 1 cup (100-150g per serving)
                  Small Dessert (e.g., pastry, cookie): 1 piece (30-60g per piece)
                  Dairy Serving (e.g., milk, yogurt): 1 cup (100-150g per cup)
                  Cheese: 1 slice or cube (20-30g per slice)
                  Beverage (e.g., tea, juice): 1 cup (200-300g per cup)
                  Nuts and Seeds: 1 handful (20-30g per serving)
                  Meat/Fish/Poultry: 1 portion (100-150g per serving)
                  Egg: 1 large egg (50g per egg)
                  Oil/Butter: 1 teaspoon (5g per teaspoon)

                  Guidelines:
                  - Use English food names only
                  - Avoid generic terms like "food" or "dish"
                  - Return empty array [] if no items identified
                 Step 2: Calculate Nutrition
                 Using the meal data, calculate and return ONLY this nutrition JSON array as this json array is format in which you give response and always include units of values:
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
                      {"summary": "Create a detailed 1000-character report summary that includes the food name, its country or region of origin, and a comprehensive breakdown of all key nutritional values (macronutrients, micronutrients, fiber, sugar, etc.) to assist doctors and dieticians in analyzing its health benefits, risks, and relevance for fitness or medical purposes in a clear and professional manner."}
                  ]
                    Strict Notes:
                    - Use standard nutritional averages for calculations.
                    - Always include units for all nutritional values.
                    - Do not exaggerate nutritional values especially; estimates must be close to actual values based on the portion size.
                    - Only return the final nutrition JSON array in response.
                    - Above given json array is nutrition data format dont return that, only return final nutrition JSON array in response when get estimated from the meal
              `,
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
    console.log(response.choices[0].message);
    const rawContent = response.choices[0].message.content;
    const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response.");
    }
    const nutritionData = JSON.parse(jsonMatch[0]);
    return nutritionData;
  } catch (error) {
    console.error("Error analyzing food image:", error);
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
          content: `As an expert dietician, provide a concise yet comprehensive analysis of this meal based on the following six key aspects. For each point, provide only the most relevant insights, strictly adhering to the format and guidelines.
         1. Health Impact Analysis: Focus on energy, digestion, and fitness-related outcomes (e.g., weight loss or muscle gain).
         2. Dietary Pattern Alignment: State if it suits specific fitness goals or is better for occasional indulgence.
         3. Improvement Suggestions: Recommend realistic and fitness-friendly changes by replacing or adding to enhance nutritional value.
         4. Special Considerations: Mention allergens, unique impacts (e.g., digestion, energy), or health risks.
         5. Frequency Recommendation: Provide an appropriate frequency (daily, weekly, monthly) based on fitness goals and meal quality.
          Meal Summary to Analyze: ${summary}
          Provide a structured analysis focusing only on the most relevant points for this specific meal. Use professional yet accessible language.
          Strict Notes: 
          - Response must strictly be in this array format:["", "", "", "", ""]
          - Length limit: Each point must not exceed 15-18 words.
          - Language: Use simple, English should be easy for everyone to understand.
          - Insights: Must reflect realistic dietary habits and not encourage frequent consumption of unhealthy meals.
          - Focus: Professional, concise, and relevant for fitness and health goals.
          - Nothing should be the part of response other than the array of length 5.
          `,
        },
      ],
    });

    // console.log(response.choices[0].message);
    const rawContent = response.choices[0].message.content;
    const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response.");
    }
    const analysis = JSON.parse(jsonMatch[0]);
    // console.log(analysis);
    return analysis;
  } catch (error) {
    console.error("Error analyzing meal summary:", error);
    throw error;
  }
}
