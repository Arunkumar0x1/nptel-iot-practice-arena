# NPTEL IoT Practice Arena — Question Bank Extraction & Validation Report

## Executive Summary
- **Source Document**: `NPTELQUIZ.pdf` (93 pages)
- **Course Title**: Introduction to Internet of Things
- **Course Provider**: NPTEL / Indian Institute of Technology Kharagpur
- **Extraction Timestamp**: 2026-10-16
- **Status**: **100% Complete & Verified**

---

## 1. Quantitative Overview
- **Total Questions Extracted**: 180
- **Expected Questions (12 Weeks × 15 Questions)**: 180
- **Extraction Completeness**: 100% (0 missing, 0 duplicates)
- **Marks per Question**: 1 mark each (15 marks per week, 180 total marks)

---

## 2. Weekly Question Counts
| Week | Focus Topics (from lectures) | Questions Extracted | Expected | MCQ | MSQ | True/False |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **Week 1** | Introduction to IoT, Sensing, Actuation, Basics of IoT Networking Part-I | 15 | 15 | 7 | 4 | 4 |
| **Week 2** | MQTT, SMQTT, CoAP, AMQP, IEEE 802.15.4, ZigBee, 6LoWPAN, RFID | 15 | 15 | 7 | 6 | 2 |
| **Week 3** | Wired HART, Z-Wave, Sensor Nodes, NFC, Bluetooth | 15 | 15 | 8 | 0 | 7 |
| **Week 4** | Sensor Networks, Nanodevices, Coverage, WSN, Data Mules, UAV Networks, M2M | 15 | 15 | 12 | 1 | 2 |
| **Week 5** | Interoperability (UMB), Arduino Programming, DHT Sensor, Motors | 15 | 15 | 13 | 0 | 2 |
| **Week 6** | Python Programming, Sockets, Raspberry Pi 3 Model B, Camera, Auto-cooling | 15 | 15 | 14 | 0 | 1 |
| **Week 7** | Remote Data Logging, Matplotlib, SDN, OpenFlow, SDN-WISE (INPP) | 15 | 15 | 14 | 0 | 1 |
| **Week 8** | Software-Defined IoT, ODIN, Mobi-Flow, Mininet-WiFi, Cloud Computing, NIST, IaaS/PaaS, SLA, CloudSim | 15 | 15 | 15 | 0 | 0 |
| **Week 9** | OpenStack (Nova, Horizon, Devstack), Sensor-Cloud, Virtual Sensors (CoV-I), Fog Computing | 15 | 15 | 15 | 0 | 0 |
| **Week 10** | Smart Cities, Data Fusion, Smart Parking, Energy Harvesting, HAN (Zigbee, X-10), Connected Vehicles (V2X, DSRC, ICV) | 15 | 15 | 15 | 0 | 0 |
| **Week 11** | Smart Grid, Smart Meters, Net Metering, PMU, IIoT, DSRC in ITS, Mining WSN, Big Data (Veracity), HDFS | 15 | 15 | 15 | 0 | 0 |
| **Week 12** | Data Analysis (Qualitative, ANOVA, Pearson r), AgriSens Water Management, IoT Healthcare, Activity Monitoring | 15 | 15 | 15 | 0 | 0 |
| **Total** | **All 12 Weeks** | **180** | **180** | **150** | **11** | **19** |

---

## 3. Question Types Breakdown
- **MCQ (Multiple Choice Questions - Single Selection)**: 150 questions (83.3%)
- **MSQ (Multiple Select Questions - Multi Selection)**: 11 questions (6.1%)
  - `week1-q2` (Answers: a, b, c)
  - `week1-q7` (Answers: a, b, c, d)
  - `week1-q10` (Answers: a, b, d)
  - `week1-q14` (Answers: a, b, c)
  - `week2-q2` (Answers: a, b, d)
  - `week2-q3` (Answers: a, b, c)
  - `week2-q6` (Answers: a, b, c, d)
  - `week2-q8` (Answers: a, b, c)
  - `week2-q9` (Answers: a, b, c, d)
  - `week2-q12` (Answers: a, b, c)
  - `week4-q3` (Answers: a, b)
- **True / False Questions**: 19 questions (10.6%)
  - Handled cleanly as binary choice with unambiguous labeling.

---

## 4. Integrity and Data Quality Checks
- **Duplicate Question IDs**: 0 duplicates (all 180 IDs `week1-q1` to `week12-q15` are strictly unique).
- **Missing Answers**: 0 missing. Every question has verified `correctAnswers`.
- **Missing Explanations**: 0 missing. All 180 questions have full detailed explanations preserved.
- **Missing Lecture/Page References**: 0 missing. Every question includes its exact lecture reference or textbook citation.
- **Answer Letter Parsing Verification**:
  - Successfully handled English conjunctions (e.g. "a, b, and c" parsed as `['a', 'b', 'c']` rather than false-positive `d`).
  - Handled numeric answer values in option strings (e.g., Week 3 Q2 `b. 908.42, 868.42` properly parsed as option `b`).
  - Handled inverted True/False option orderings (e.g., Week 1 Q13 where option `a` is False and `b` is True).

---

## 5. Conclusion
The question bank is 100% verified against `NPTELQUIZ.pdf` and ready for use in both Week-wise Practice Mode and Combined 12-Week Test Mode.
