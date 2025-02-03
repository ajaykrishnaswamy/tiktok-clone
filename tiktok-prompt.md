# TikTok Clone Development Plan

## Overview
This project is a TikTok clone built using **Next.js**, **Supabase**, and **Vercel**. The core functionalities such as video scrolling, uploading, and playing have already been implemented. The next steps involve building an advanced recommendation system based on the **TikTok Monolith Paper**, adding engagement features (likes, dislikes, and comments), and improving the overall user experience.

## Completed Features
- **Scrolling of videos**: Users can seamlessly scroll through videos.
- **Uploading videos**: Users can upload videos, which are stored in **Vercel Storage** and metadata is managed in **Supabase**.
- **Displaying videos**: Videos are properly rendered and played.
- **Creating and storing video embeddings**: Video embeddings are generated and stored for future recommendations.

## Features To Implement

### 1. Video Recommendation System
The recommendation engine will be based on the **Monolith** recommendation system as described in the attached **TikTok Monolith Paper**. This system leverages a **collisionless embedding table** and **real-time online training**.

#### **Key Features of the Recommendation System**
1. **User interaction-based ranking**
   - Track engagement metrics such as:
     - Time watched
     - Likes and dislikes
     - Comments
     - User profile attributes
2. **Real-time feedback loop**
   - Implement an **online training model** where user interactions dynamically update the recommendation model.
3. **Sparse feature handling**
   - Utilize a **collisionless hash table** for feature embeddings to prevent quality degradation.
4. **Non-stationary data adaptation**
   - Address concept drift by prioritizing recent interactions for better personalization.

#### **Implementation Steps**
1. **Extract user interaction signals** from Supabase.
2. **Preprocess and generate embeddings** for videos and users.
3. **Build a model using TensorFlow/PyTorch** to predict relevant videos.
4. **Deploy the recommendation model** using **Vercel Functions** or **Supabase Edge Functions**.
5. **Continuously update recommendations** based on new user interactions.

### 2. Engagement Features
- **Likes & Dislikes**: Users can like/dislike videos, affecting their personal recommendations.
- **Comments**: Users can leave comments on videos.
- **User Profiles**: Store user preferences, liked videos, and watched history.

### 3. Improved Recommendation Transparency
- **Clear explanation of how recommendations work**
- **Show related videos based on explicit user preferences**

## Technical Stack
- **Frontend**: Next.js (React-based framework)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Storage**: Vercel Storage (for video blobs)
- **Machine Learning**: TensorFlow/PyTorch for real-time recommendations

## Next Steps
- Implement the recommendation system and integrate with the existing video playback flow.
- Develop user engagement features and store interactions in Supabase.
- Conduct testing and performance tuning to ensure seamless user experience.

## Deliverables
- A **working recommendation system** integrated into the TikTok clone.
- Functional **like, dislike, and comment** features.
- A **clear explanation** of how recommendations are generated.

---
This plan will guide the development process and ensure efficient implementation of the new features.

