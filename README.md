
# Blockchain Fee Reporter Service

This Node service is designed to retrieve and report the transaction fees of three blockchain networks: **Bitcoin**, **Binance Smart Chain (BSC)** and **Ethereum**. The service logs the estimated transaction fees every 10 seconds, offering a reliable and up-to-date report on the costs associated with transactions on these blockchains.

This project was developed as part of a coding assignment, aiming to join this incredible team.

## Table of Contents

- [Introduction](#introduction)
- [Functional Overview](#functional-overview)
- [Non-Functional Requirements Done](#non-functional-requirements)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Service](#running-the-service)
- [Additional Features Done](#additional-features)
    - [Extra Network](#ExtraNetwork)
    - [Async Network Calls](#AsyncNetworkCalls)
    - [Caching Layer](#CachingLayer)
    - [Testing](#testing)
    - [Dockerization](#dockerization)
- [Contributing](#contributing)

## Introduction

The Blockchain Fee Reporter Service is a NodeJs application that periodically fetches transaction fees from Bitcoin, Binance Smart Chain and Ethereum. The service estimates the fee per transaction and logs the information in a specified format, if it didn't receive the same value previously.

## Functional Overview

The service performs the following tasks every 10 seconds:

1. **Query Fee Endpoints**: It retrieves the transaction fee data from the specified endpoints.
2. **Estimate Fees**: It calculates the estimated fee per transaction based on the provided criteria:
   - **Bitcoin**: The fee for a transaction of size 140 vB to be included in the next 3 blocks.
   - **Binance Smart Chain**: The fee for a transaction with a gas limit of 55,000 to be included in a block as quickly as possible.
   - **Ethereum**: The fee for a transaction with a gas limit of 21,000, using the average gas price recently.
3. **Log Fees**: The service logs the fee in the format:
   ```
   Fee for <blockchain network> at <iso datetime>: <fee> <unit>
   ```
   Example:
   ```
   Fee for Bitcoin at 2023-05-18T15:17:00+00:00: 0.00012 BTC
   ```
    it'll will be logged if it didn't calculate the same value previously. And all logs will be stored in `logs/`, so we could create a log collector to use these data in logs.


4. **Graceful Shutdown**: The service handles SIGTERM or SIGINT signals to stop the process gracefully.

5. **Graceful Shutdown**: The service can be started easily, running a simple command.

## Non-Functional Requirements

- **Separation of Concerns**: The code is modular, separating the scheduler, fee retrieval, fee calculation, logging functions, and other services
- **Error Handling**: The service handles potential errors, such as network issues or broken connections, ensuring robustness.
- **Unit Testing**: The fee calculation logic is thoroughly unit tested to ensure accuracy. ( `npm run test`)


obs: I used the functional style to be simpler and because of the time. But I could use other styles, like OOP, etc.


## Getting Started

### Pre-requisites

- Docker
- Docker Compose
- NPM

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VitorBrangioni/track-blockchain-fee.git
   cd track-blockchain-fee
   ```

2. Install dependencies using NPM:
   ```bash
    npm install
   ```

### Running the Service

To start the service using npm and docker-compose, run the following command:

```bash
npm run start-service
```

This will start the service, and you should see logs appearing every 10 seconds (you can see by terminal or .log files - If it hasn't received the same value previously, as requested), reporting the fees for Bitcoin, Binance Smart Chain and Ethereum.

To stop the service, simply finish the docker using `docker stop ${CONTAINER_ID}`, and it will shut down gracefully.

## Additional Features Done

###  ✅ Extra Network

Integrated an additional blockchain network (Ethereum) by implementing the necessary fee retrieval and calculation logic.

### ✅ Async Network Calls

The service was created using async style to make non-blocking network calls and non-blocking calculation, improving efficiency and scalability.

### ✅ Caching Layer

A caching mechanism is implemented to avoid logging redundant fee information if the fee remains unchanged from the previous check. *A Redis container was created for this cache layer.

### ✅ Testing

Implemented unit tests to ensure that the service will work healthy.

To run the unit tests for the fee calculation logic, use the following command:

```bash
npm run test
```

This will execute all tests.

You can see the report on test coverage, using this command:

```bash
npm run test:cov
```

### ✅ Dockerization

To run the service in a Docker container, follow these steps:

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Run the Docker container:
   ```bash
   docker-compose up fee-track 
   ```

The service will now run inside the Docker container, logging fee data every 10 seconds.

There's a shortcut to run by docker compose, using the command: 

```bash
   npm run start-service
   ```

## Contributing

I am always eager to improve myself. Your feedback is valuable and can help me grow. I welcome any insights you can share! 

Feel free to reach out with suggestions or advice 😊

