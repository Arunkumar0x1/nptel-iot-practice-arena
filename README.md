# NPTEL IoT Practice Arena

> **Practise. Improve. Master IoT.**  
> A responsive, client-side examination platform for practising and mastering all 12 assignment weeks of the NPTEL course **Introduction to Internet of Things** (conducted by IIT Kharagpur), based exclusively on the verified curriculum question bank.

---

## 🌟 Key Features

- **100% Verified Question Bank (180 Questions)**:
  - Extracted directly from course assignments across **all 12 weeks** (15 questions per week).
  - Preserves exact question wording, options, answer keys, explanations, and lecture/textbook citations.
  - Full support for **MCQ (Single Choice)**, **MSQ (Multiple Select)**, and **True/False** questions.
- **Zero Immediate Answers**: Answers, green/red feedback indicators, and solutions remain strictly hidden until the test is submitted.
- **Two Practice Modes**:
  - **Week-wise Practice**: Select any week (Week 1 to Week 12) to drill down on specific modules.
  - **12-Week Combined Examination**: Comprehensive full-syllabus test with all 180 questions and week-by-week score analytics.
- **Configurable Examination Controls**:
  - Independent **Question Order Shuffling** (Fisher-Yates random permutation).
  - Independent **Answer Option Shuffling** (preserves internal option IDs so scoring remains 100% accurate).
  - Optional **Countdown Timer** with customizable minutes and automated submission at 0.
- **Examination Interface**:
  - Interactive question navigation palette with Answered, Unanswered, and Current states.
  - Previous / Next buttons and arrow key keyboard shortcuts (`←` / `→`).
  - Answer modification and "Clear Choice" option before submission.
  - Submission confirmation dialog warning about any unanswered questions.
- **Rigorous Scoring Engine**:
  - 1 mark per correct answer; 0 marks for incorrect or skipped answers.
  - MSQ questions require an exact match of the correct option set (no arbitrary partial credit).
  - Total score, percentage, attempted count, skipped count, and accuracy rate calculation.
- **Detailed Post-Submission Review**:
  - Color-coded comparison showing correct answers in green and user errors in red.
  - Full original detailed solution and module/slide/textbook lecture citation for every question.
  - Filter by All Questions, Missed Questions, or Correct Questions.
  - Retake Missed Questions mode to reinforce weak areas.
- **Local Persistence & Privacy**:
  - Saves completed attempts, best scores per week, and preferences to browser `LocalStorage`.
  - Zero server, zero API costs, zero database, zero telemetry, and zero user account required.
  - Works completely offline after initial load.
- **Modern UI & Responsive Design**:
  - Built with Navy Blue and clean accent theme inspired by official academic examination portals.
  - Light and Dark mode toggle.
  - Fully responsive across desktop, laptop, tablet, and mobile browsers.

---

## 📊 Question Bank Validation Summary

| Week | Focus Topics | Total Questions | MCQ | MSQ | True/False |
|:---:|:---|:---:|:---:|:---:|:---:|
| **1** | Introduction to IoT, Smart Dust, M2M vs IoT, Sensing & Actuators | 15 | 7 | 4 | 4 |
| **2** | MQTT, SMQTT, CoAP over UDP, AMQP, IEEE 802.15.4, ZigBee, 6LoWPAN | 15 | 7 | 6 | 2 |
| **3** | Wired HART, Z-Wave, Sensor Nodes, NFC, Bluetooth Piconets | 15 | 8 | 0 | 7 |
| **4** | Agricultural Intrusion Detection, Nanodevices, WSN, UAVs, M2M | 15 | 12 | 1 | 2 |
| **5** | Interoperability (UMB), Arduino UNO, DHT Sensors, Servo Motors | 15 | 13 | 0 | 2 |
| **6** | Python Data Types, Sockets, Raspberry Pi 3 Model B, Camera, Relays | 15 | 14 | 0 | 1 |
| **7** | Remote UDP Logging, Matplotlib, SDN Switches, OpenFlow, SDN-WISE | 15 | 14 | 0 | 1 |
| **8** | Software-Defined IoT, ODIN, Mobi-Flow, NIST Cloud, IaaS, SLA | 15 | 15 | 0 | 0 |
| **9** | OpenStack (Nova, Horizon, Devstack), Sensor-Cloud, Fog Computing | 15 | 15 | 0 | 0 |
| **10** | Smart Cities, Data Fusion, Smart Parking, HAN, Connected Vehicles | 15 | 15 | 0 | 0 |
| **11** | Smart Grid, Net Metering, PMU, IIoT, Mining WSN, Big Data & HDFS | 15 | 15 | 0 | 0 |
| **12** | Data Analysis (ANOVA, Pearson r), AgriSens, Healthcare, Activity Logging | 15 | 15 | 0 | 0 |
| **Total** | **All 12 Modules Verified** | **180** | **150** | **11** | **19** |

See `src/data/VALIDATION_REPORT.md` for the complete extraction audit.

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Unit Testing**: [Vitest](https://vitest.dev/)
- **Storage**: Browser `localStorage` API

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (version 18 or newer) installed.

### 1. Installation

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 2. Development Server

Start the local Vite development server:

```bash
npm run dev
```

Visit the displayed local URL (typically `http://localhost:5173/`).

### 3. Run Automated Tests

Execute the Vitest test suite covering the question bank, shuffling, scoring engine, and statistics:

```bash
npx vitest run
```

### 4. Build for Production

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

The production output will be generated in the `dist/` directory.

---

## 🌐 Deploying to GitHub Pages

The application is pre-configured with a relative base path (`./` in `vite.config.ts`), making it deployable under any GitHub Pages subpath (e.g. `https://<username>.github.io/<repository-name>/`) without broken assets.

### Option A: Automatic Deployment via GitHub Actions (Recommended)

1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The included workflow `.github/workflows/deploy.yml` will automatically run on every push to the `main` branch, test the codebase, build the assets, and publish the site.

### Option B: Manual Deployment via `gh-pages`

If you prefer deploying from your local machine:

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add the deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run:
   ```bash
   npm run deploy
   ```
4. In GitHub repository **Settings** → **Pages**, set the branch to `gh-pages` / `/ (root)`.

---

## 📝 Updating or Extending the Question Bank

All questions reside in `src/data/questions.json`. Each question adheres to the following structure:

```json
{
  "id": "week1-q1",
  "week": 1,
  "number": 1,
  "type": "MCQ",
  "question": "According to the ITU Internet Report 2005 discussed in the lecture, the future Internet is expected to become wider and more complex mainly because:",
  "options": [
    { "id": "a", "text": "Humans will completely stop using the Internet" },
    { "id": "b", "text": "Most Internet traffic may flow between devices and different kinds of things" },
    { "id": "c", "text": "Only desktop computers will remain connected" },
    { "id": "d", "text": "Internet communication will be restricted to email services" }
  ],
  "correctAnswers": ["b"],
  "explanation": "The ITU report describes a future where humans may become a minority as generators and receivers of traffic...",
  "lectureReference": "See lecture 1 Introduction to IoT — Part-I @ 03:10",
  "marks": 1
}
```

- For **MSQ questions**, set `"type": "MSQ"` and list all correct option IDs in `"correctAnswers": ["a", "b", "c"]`.
- For **True/False questions**, set `"type": "TF"` and provide options `[{"id":"a","text":"True"},{"id":"b","text":"False"}]`.
- After modifying questions, run `npx vitest run` to ensure all IDs, options, and answers pass the automated test assertions.

---

## 🔒 Security and Privacy Disclosure

- **Client-Side Static Architecture**: This application operates purely in the browser. While the user interface strictly conceals answer keys and explanations until test submission, technically proficient users can inspect client-side bundles and network resources to view raw data. A static web app cannot guarantee cryptographic secrecy of answer keys against developer tool inspection.
- **Privacy**: No user accounts, credentials, or personal information are requested or collected. All practice history and score records reside solely in your local browser storage and are never uploaded to any server.

---

## 📜 License & Acknowledgments

This educational practice platform is created for peer review and learning purposes based on the NPTEL curriculum *Introduction to Internet of Things* offered by Indian Institute of Technology (IIT) Kharagpur. Course materials, assignments, and lectures remain the intellectual property of NPTEL and the respective instructors.
