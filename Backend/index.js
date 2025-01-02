import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Books from "./books.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// API route to fetch advice
app.get("/api/advice", async (req, res) => {
  try {
    // Get category from query params
    const category = req.query.category;
    let selectedCategoryBooks = [];

    // Based on category, select books
    if (category === "Finance") {
      selectedCategoryBooks = Books.finance;
    } else if (category === "Health") {
      selectedCategoryBooks = Books.Health;
    } else if (category === "SelfHelp") {
      selectedCategoryBooks = Books.SelfHelp;
    } else if (category === "Spirituality") {
      selectedCategoryBooks = Books.Spirituality;
    } else if (category === "Relationships") {
      selectedCategoryBooks = Books.Relationships;
    } else {
      return res.status(400).json({ error: "Invalid category selected" });
    }

    // Select a random book from the selected category
    const randomBook = selectedCategoryBooks[Math.floor(Math.random() * selectedCategoryBooks.length)];

    // Generate advice for the selected book
    const prompt = `Summarize 6 great life lessons in 50-100 words each from the book "${randomBook}". Make them simple and profound. in a json format. where there should be array of objects with  type of adivce key = 'type' and advice itself key = 'advice'. `;
    const adviceList = [];

    try {
      const result = await model.generateContent(prompt);

      const bookAdvice = result.response.text(); // Correct way to access text

      function removeBackticksAlt(str) {
        return str.split('`').join('').slice(4);
      }

      const newBookAdv = JSON.parse(removeBackticksAlt(bookAdvice))
      console.log(newBookAdv, randomBook )
      // If advice is generated, split it into 5 pieces and push into adviceList
    
      if(newBookAdv.length > 0) {
        const advicePieces = newBookAdv;
        advicePieces.forEach((advice, index) => {
          adviceList.push({
            book: randomBook,
            adviceType: advice.type,
            advice: advice.advice,
          });
        });
      } else {
        console.error(`No advice generated for book "${randomBook}".`);
        adviceList.push({
          book: randomBook,
          advice: `No advice available for "${randomBook}".`,
        });
      }
    } catch (bookApiError) {
      console.error(`Error calling Gemini API for book "${randomBook}":`, bookApiError);
      adviceList.push({
        book: randomBook,
        advice: `API Error while fetching advice for "${randomBook}".`,
      });
    }

    res.json(adviceList);
  } catch (error) {
    console.error("Overall error:", error);
    res.status(500).json({ error: "Failed to generate advice." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
