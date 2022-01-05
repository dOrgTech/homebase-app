# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Migration tool for V2 contracts
- Sending XTZ directly to DAO address
- Delegating DAO's XTZ to baker
- Changing DAO configuration parameters

## [1.0.6] - 2022-01-05
### Added
- Support for Audio NFTs
- Unsupported media message for NFTs

### Fixed
- Proposal Fee in proposal form
- Proposal form bug preventing creation, when opening from NFT/Treasury/Registry page directly
- XTZ balance in Proposal form

## [1.0.5] - 2021-12-30
### Fixed
- Only displaying first 10 NFTs in NFT page
- Bug making NFT page crash if NFT had no indexed authors
- Proposal creation and related action buttons being enabled even if not on proposal period

## [1.0.4] - 2021-12-23
### Added
- New visual identity for the whole application

### Changed
- Removed Granadanet and Florencenet testnets

### Fixed
- Support for non-OBJKT NFTs

## [1.0.3] - 2021-11-24
### Added
- Support for Hangzhounet

### Changed
- Fixed XTZ balances not showing properly on DAO treasuries
- Added distinction between inbound and outbound transfers in DAO transfer history
- Fixed XTZ balance in transfer proposal creation displaying as mutez

## [1.0.2] - 2021-11-17
### Added
- Support for Granadanet

## [1.0.1] - 2021-10-19
### Added
- NFT page
- NFT details modal
- NFT transfer dialog and proposal details

## [1.0.0] - 2021-09-07
### Added
- Agora integration
- TZ Profiles integration
- User page
- Display of user balances
- Landing page
- Warning footer

### Changed
- Fetching data from [Homebase's indexer](https://github.com/dOrgTech/homebase-indexer)
- Fixed proposal history
- Fixed proposal status and its real-time updating
- Registry page style
- Treasury page style

### Breaking changes
- Upgraded BaseDAO contracts to [v0.4](https://github.com/tezos-commons/baseDAO/tree/b3aa7886950d4f1eb65816ed726ce69e77e14472) - DAOs created prior to this upgrade are deprecated