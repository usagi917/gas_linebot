# GAS Line Bot

This repository contains a Google Apps Script (GAS) implementation of a LINE bot. The bot responds to messages sent by users and handles various webhook events triggered by the LINE Messaging API. This is useful for creating interactive chatbots and automating responses to user input on the LINE messaging platform.

## Features

- **Message Handling**: The bot receives messages from LINE users and processes them.
- **Postback Events**: The bot can handle postback events triggered by user actions.
- **Quick Replies**: Pre-defined quick reply options for the user to choose from.
- **Rich Responses**: The bot sends rich responses like text, stickers, and other multimedia types.
- **Error Handling**: Custom error logging and reporting mechanisms.

## Prerequisites

- **Google Apps Script (GAS)** account.
- **LINE Messaging API**: You need a LINE developer account and a channel configured to use the Messaging API.
- **LINE Channel Access Token**: This is used to authenticate your bot with the LINE platform.
- **LINE Channel Secret**: A unique identifier for your channel to verify requests.

## Setup Instructions

1. **Clone this repository** or copy the contents of the `linebot.js` file into your Google Apps Script project.

2. **Configure your LINE Messaging API** by logging into the [LINE Developers Console](https://developers.line.biz/console/) and creating a new channel if you don’t have one already.

3. **Set up a Webhook URL**: In the LINE Developers Console, set the Webhook URL to the Google Apps Script web app URL. Make sure your GAS deployment is set to "execute as me" and the access level is set to "Anyone, even anonymous."

4. **Set Environment Variables**:
   - In the `linebot.js` script, update the following variables:
     - `LINE_CHANNEL_ACCESS_TOKEN`: Your LINE Channel Access Token.
     - `LINE_CHANNEL_SECRET`: Your LINE Channel Secret.

5. **Deploy the GAS project as a web app** by following these steps:
   - In the Google Apps Script editor, click on `Deploy` → `Manage Deployments` → `New Deployment`.
   - Select `Web App` and configure the deployment as described in step 3.
   - Copy the Web App URL and paste it into the Webhook URL field in the LINE Developers Console.

6. **Test the Bot**: Send a message to your LINE bot to ensure that it responds as expected. Check the log in Google Apps Script to troubleshoot any issues.

## File Overview

- **linebot.js**: Main script that handles webhook requests from the LINE Messaging API. Key functions include:
  - `doPost(e)`: Entry point for handling POST requests from the LINE API.
  - `handleMessageEvent(event)`: Processes incoming messages and responds to the user.
  - `handlePostbackEvent(event)`: Handles postback data sent by quick replies or other interactive features.
  - `sendTextMessage(replyToken, message)`: Sends a text response back to the user.

## Example Usage

Once deployed, your LINE bot will automatically respond to messages sent by users on LINE. You can customize the bot's responses and behavior by modifying the `handleMessageEvent` and `handlePostbackEvent` functions.

## Contributing

If you'd like to contribute to this project, feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
