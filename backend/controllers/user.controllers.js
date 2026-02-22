import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.models.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default getCurrentUser;

export const updateAssistant = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { assistantName, selectedImage } = req.body;

    if (!assistantName) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    let assistantImage;

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      assistantImage = uploaded.secure_url;
    } else {
      assistantImage = selectedImage;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true },
    ).select("-password");

    return res.status(200).json({ user });
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ message: "Command is required" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.history.push(command);
    await user.save();

    const assistantName = user.assistantName;
    const userName = user.name;

    const response = await geminiResponse(command, assistantName, userName);

    console.log("Gemini raw response:", response);

    let cleaned = response.trim();

    cleaned = cleaned.replace(/```json|```/g, "").trim();

    const jsonMatch = cleaned.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res
        .status(400)
        .json({ response: "Invalid response format from assistant." });
    }

    let gemResult;

    // ✅ Safe JSON parsing
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return res.status(400).json({ response: "Invalid JSON from assistant." });
    }

    const type = gemResult.type;

    switch (type) {
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("h:mm A")}`,
        });

      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("MMMM Do YYYY")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });

      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "get_time":
      case "get_date":
      case "get_day":
      case "get_month":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "open_whatsapp":
      case "open_twitter":
      case "open_linkedin":
      case "open_github":
      case "open_settings":
      case "open_email":
      case "news_search":
      case "map_search":
      case "definition":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({ response: "I did not get that." });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({ message: error.message });
  }
};
