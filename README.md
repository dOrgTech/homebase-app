# Tezos Homebase
[![](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

Homebase is a platform designed to let users create and manage DAOs on the Tezos blockchain.

# Prequisites
The following dependencies are required to run homebase-app:

| Dependency | Version|
|-|-|
| [Node][node] | `v12.18.4` or above |
| [Yarn][yarn] | `v1.22.*` or above |

# Third Party Services

The following third party services are being used by Homebase:

* [TZKT API](https://api.tzkt.io/)
* [Better Call Dev API](https://better-call.dev/docs)
* [Pinata IPFS](https://pinata.cloud/)
* [Airgap's Beacon SDK](https://github.com/airgap-it/beacon-sdk)

# Using Homebase

## Creating a DAO

1. Go to https://tezos-homebase.herokuapp.com/
2. Click on the `Create a DAO` button

You will be taken to the DAO Creator, from which you will be asked to choose on the currently supported DAO templates.

3. Select one of the supported DAO templates
4. Fill the DAO creation form. You will be asked to fill:

**DAO Settings**:

  * DAO Name: this will also be the name of the DAO's token.
  * Token Symbol
  * Description

**Proposals and Voting**:

  * **`Voting period duration`**
  * **`Required stake to propose`**: required amount of DAO tokens to stake at the time of proposing. Currently follows the formula: `b + a * proposalSize`
  * **`Returned stake after proposal rejection`**
  * **`Transfer amounts`** **(Treasury only)**: maximum and minimum amounts that can be transferred in a treasury proposal transfer. Currently only supports `XTZ`
  * **`Quorum threshold`**: currently a natural number representing the total amount of votes required for a proposal to pass. Each token staked in a vote operation represents a vote. Therefore, with a quorum treshold of 500, a vote that stakes 500 tokens would make the proposal pass.
  * **`Maximum proposal size`**

**Distribution Settings**:

  * **`TokenHolders`**: initial token holder addresses and their initial balances. At least 1 is required.
  * **`Administrator`**

5. You will then be taken to the review page. From here, click the `LAUNCH` button on the bottom right corner.
6. You will be redirected to the Launch screen. Do not close your browser tab until the whole process is complete (you are able to see and track progress by looking at the progress bar of this screen). You will be asked to connect your wallet if you haven't already, and then will be asked for 2 signatures: the first one originates the `Metadata Carrier` contract and the second one originates the actual `DAO contract`. When the originations are complete you will see a success message and a `Go to my DAO` button

## Exploring DAOs

Go to the home screen. From there you will see a list of all DAOs created in Homebase. They load in groups of 8 for load balancing (will be improved later on with indexer).
There is a searchbar available, however, note that searches done using this bar will only yield DAOs that have been already fetched, it will not trigger additional async requests.

Specific DAOs can be explored by clicking on them in the home screen or by URL:

`https://tezos-homebase.herokuapp.com/explorer/dao/${DAO_ADDRESS}`

## Managing a DAO

All DAOs, regardless of their template, have:

**DAO page**: contains all general DAO information. Here you can see:
  * Current cycle
  * Time left to vote
  * DAO name and description
  * DAO template type
  * Token holders and their balances
  * Active proposals
  * Frozen tokens
  * Voting addresses
  * `Flush` button

**Proposals page**: contains all proposals related information and related actions. Here you can see:
  * DAO name
  * `New Proposal` button and creation modal
  * `Flush` button
  * Active proposals
  * Frozen tokens
  * Voting addresses
  * Tables with all proposals, passed proposals and active proposals. Each proposal item contains:
    * Title
    * Hash
    * Creation date and cycle
    * Quorum reached vs quorum treshold
    * For/Against votes vs total votes

**Proposal detail page**: contains all specific information about a proposal and vote actions. Here you can see:
  * Breakdown of the proposal's details (transfers to execute, registry items to update, among others)
  * Proposal title and description
  * Status badge and history
  * Quorum reached vs quorum treshold
  * Proposer
  * For and against votes, each with a detailed modal
  * Vote for and against buttons and modals. Only enabled if proposal is active

**Proposal creation modal**: all proposal creation modals support multiple operations batched in the same proposal and also allow the user to batch upload transactions with a JSON file. This JSON should follow a specific signature, based on the template type of the DAO. See [proposal JSON signatures for each template](#dao-template-specific-pages-and-details)

### DAO Template specific pages and details:

Each DAO template has unique pages related to template specific actions. Also, the proposal creation modals are different accross templates.

### **Registry**

**Registry** page: this page contains a table where all registry items can be visualized, and a table that contains a history of all proposals that updated the registry.
Each registry item can be clicked to get a read-only modal that displays the item's key and full value, additionally, clicking the settings icon in each row opens a modal to create a proposal to edit the clicked item. This page also contains a `New Item` button to create a proposal to add a new item.

**Proposal types**

There are 2 types of registry proposals:

- Edit proposals: used to edit one or several registry items
- Add proposals: used to add one or several items to the registry

At a contract level, there is no such distinction, but in the UI it exists to let the user create a new key or select a key from a dropdown of existing keys, depending on his intention.

**Proposal JSON signature**:

```json
{
  "foo": "baz",
  "bar": "qux",
  ...
}
```

### **Treasury**

**Holdings/Treasury** page: this page contains a table with all DAO holdings organized by token (currently, only supporting `XTZ`). And also contains a table with all outbound transfers made from the DAO.

**Proposal JSON signature**:

```json
[
  {
    "amount": 15,
    "recipient": "tz1RKPcdraL3D3SQitGbvUZmBoqefepxRW1x"
  },
  {
    "amount": 20,
    "recipient": "tz1Zqb3hBBN8wLcJYhADcasi1jZdp2YLdG3L"
  },
  ...
]
```

# Contributing
## Running the project

To run the project:

- Make sure you have node installed
- Clone this repository
- Go to the project and run: `yarn && yarn dev`
- Create a `.env` file in the root and ask one of the maintainers for the Pinata API Key