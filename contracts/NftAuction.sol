pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./ERC20.sol";
import "./Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NftAuction is Ownable{
    using SafeMath for uint256;

    // Represents an auction on an NFT
    struct Auction {
        // Current owner of NFT
        address seller;
        // Price (in wei) at beginning of auction
        uint256 startingPrice;
        uint256 highestBidAmount;
        address highestBidder;
        uint64 duration;
        uint64 startedAt;
        bool isFixed;
    }

    mapping(uint256=> mapping(address=>uint256)) addressToBid;
    mapping(uint256 => Bid[]) bids;
    struct Bid {
        address bidder;
        uint256 amount;
    }

    ERC721 public nonFungibleContract;
    ERC20 public myToken;
    address public minter;
    uint256 public fee;

    // Map from token ID to their corresponding auction.
    mapping (uint256 => Auction) tokenIdToAuction;

    uint256[] tokenIds;
    uint256 auctionCounts;

    event AuctionCancelled(uint256 tokenId);
    event AuctionCreated(uint256 token_id, uint256 startingPrice, uint256 duration, bool isFixed);
    event ClaimSuccessful(uint256 tokenId, uint256 price, address claimer);
//    event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
    event BuySuccessful(uint256 tokenId, uint256 totalPrice, address buyer);

    //fee: 1000 : 100%
    constructor(address _nftAddr, address _myToken, address _minter, uint _fee) {
        require(_fee <= 200);
        nonFungibleContract = ERC721(_nftAddr);
        myToken = ERC20(_myToken);
        minter = _minter;
        fee = _fee;
    }

    /// @dev Creates and begins a new
    function createFixed(
        uint256 _tokenId,
        uint256 _fixPrice,
        address _seller

    )
    external
    {
        require( tokenIdToAuction[_tokenId].startedAt == 0);
        require(_fixPrice > 0);
        require( _seller != address(0));
        _escrow(_seller, _tokenId);

        Auction memory auction;
        auction.startingPrice = _fixPrice;
        auction.seller = _seller;
        auction.startedAt = uint64(block.timestamp);
        auction.isFixed = true;
        tokenIdToAuction[_tokenId] = auction;
        emit AuctionCreated(
            uint256(_tokenId),
            uint256(_fixPrice),
            uint256(0),
            true
        );
    }

    /// @dev Creates and begins a new auction.
    function createAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _duration,
        address _seller
    )
    external
    {
        // Sanity check that no inputs overflow how many bits we've allocated
        // to store them in the auction struct.

        require( tokenIdToAuction[_tokenId].startedAt == 0);
        require( _seller != address(0) );
        require(_duration >= 1 minutes);
        require( _startingPrice >0);

        _escrow(_seller, _tokenId);

        Auction memory auction;
        auction.startingPrice = _startingPrice;
        auction.seller = _seller;
        auction.startedAt = uint64(block.timestamp);
        auction.duration = uint64(_duration);
        auction.isFixed = false;
        tokenIdToAuction[_tokenId] = auction;

        tokenIds.push(_tokenId);

        emit AuctionCreated(
            uint256(_tokenId),
            uint256(_startingPrice),
            uint256(_duration),
            false
        );
    }

    /// @dev Cancels an auction that hasn't been won yet.
    function cancelAuction(uint256 _tokenId)
    external
    {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        address seller = auction.seller;
        require(msg.sender == seller);

        if ( auction.isFixed == false ){
            //transfer coins to all bidders
            Bid[] storage bids_token = bids[_tokenId];
            for (uint i = 0; i<bids_token.length; i++){
                if ( bids_token[i].bidder != address(0)
                    && bids_token[i].amount >0
                ) {
                    myToken.transfer(bids_token[i].bidder, bids_token[i].amount);
                }
            }
        }
        _removeAuction(_tokenId);
        _transfer(seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }

    function buy(uint256 _tokenId, uint256 _amount)
    external{
        tokenIdToAuction[_tokenId].seller;
        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        require( auction.seller != msg.sender);
        require(auction.isFixed == true );

        require(auction.startingPrice <= _amount);
        //transfer coin to this
        //fee
        uint256 _fee_amount = _calc_fee(_amount);
        uint256 _seller_amount = _amount.sub(_fee_amount);
        myToken.transferFrom(msg.sender, minter, _fee_amount);
        myToken.transferFrom(msg.sender, auction.seller, _seller_amount);
        //
        _transfer(msg.sender, _tokenId);
        //remove auction
        delete tokenIdToAuction[_tokenId];
        emit BuySuccessful(
            uint256(_tokenId),
            uint256(_amount),
            address(msg.sender)
        );
    }

    function bid(uint256 _tokenId, uint256 _amount)
    external
    {
        // _bid verifies token ID size
        tokenIdToAuction[_tokenId].seller;

        // Get a reference to the auction struct
        Auction storage auction = tokenIdToAuction[_tokenId];

        require(_isOnAuction(auction));
        require( auction.seller != msg.sender);
        require(auction.isFixed == false );

        // Check that the bid is greater than or equal to the current price
        uint newBidAmount = _amount;
        if (addressToBid[_tokenId][msg.sender] > 0){
            newBidAmount = addressToBid[_tokenId][msg.sender] + _amount;
        }

        require( newBidAmount>auction.highestBidAmount);

        addressToBid[_tokenId][msg.sender] = newBidAmount;

        auction.highestBidAmount = newBidAmount;
        auction.highestBidder = msg.sender;

        bool isAppended = false;
        for (uint i=0; i<bids[_tokenId].length; i++ ){
            if ( bids[_tokenId][i].bidder == msg.sender ){
                bids[_tokenId][i].amount = newBidAmount;
                isAppended = true;
                break;
            }
        }

        if (isAppended == false){
            Bid memory newBid = Bid(msg.sender, newBidAmount);
            bids[_tokenId].push(newBid);
        }

        //transfer coin to this
        myToken.transferFrom(msg.sender, address(this), _amount);

    }

    function claim(uint256 _tokenId)
    external
    {
        Auction memory auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));
        require(block.timestamp > auction.startedAt + auction.duration);
        require(auction.isFixed == false);

        uint256 bidAmount = addressToBid[_tokenId][msg.sender];
        require(bidAmount >0 );

        Bid[] storage bids_token = bids[_tokenId];

        if (auction.highestBidder == msg.sender){
            //fee
            uint256 _fee_amount = _calc_fee(bidAmount);
            uint256 _seller_amount = bidAmount.sub(_fee_amount);
            myToken.transfer(minter, _fee_amount);
            myToken.transfer(auction.seller, _seller_amount);
            _transfer(msg.sender, _tokenId);

            for (uint i = 0; i<bids_token.length; i++){
                if ( msg.sender != bids_token[i].bidder
                    && bids_token[i].bidder != address(0)
                    && bids_token[i].amount >0
                ) {
                    myToken.transfer(bids_token[i].bidder, bids_token[i].amount);
                }
            }
            _removeAuction(_tokenId);
        }else{
            for (uint i = 0; i<bids_token.length; i++){
                if ( msg.sender == bids_token[i].bidder
                    && bids_token[i].bidder != address(0)
                ) {
                    delete bids_token[i];
                }
            }
            myToken.transfer(msg.sender, bidAmount);
        }
        addressToBid[_tokenId][msg.sender] = 0;
        emit ClaimSuccessful(_tokenId, bidAmount, msg.sender);
    }

    function listAuction() external view returns(uint256[] memory){
        uint len = tokenIds.length;
        uint256[] memory _tokenIds = new uint256[](len);

        for (uint i=0; i<len; i++){
            if(tokenIds[i] != 0)
                _tokenIds[i] = tokenIds[i];
        }
        return _tokenIds;
    }

    function auctionInfo(uint256 _tokenId) external view returns(Auction memory){
        Auction memory auction = tokenIdToAuction[_tokenId];
        return auction;
    }
    function updateFee(uint _fee) external onlyOwner{
        require(_fee<=200);
        fee = _fee;
    }

    function updateMinter(address _minter) external onlyOwner{
        require(_minter != address(0));
        minter = _minter;
    }

    function updateOwner(address _owner) external onlyOwner{
        require(_owner != address(0));
        owner = _owner;
    }


    /// @dev Transfers an NFT owned by this contract to another address.
    function _transfer(address _receiver, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(address(this), _receiver, _tokenId);
    }


    /// @dev Escrows the NFT, assigning ownership to this contract.
    function _escrow(address _owner, uint256 _tokenId) internal {
        // it will throw if transfer fails
        nonFungibleContract.transferFrom(_owner, address(this), _tokenId);

    }

    function _calc_fee(uint256 _amount ) internal view returns (uint256) {
        return _amount.mul(fee).div(1000);
    }


    /// @dev Returns true if the NFT is on auction.
    /// @param _auction - Auction to check.
    function _isOnAuction(Auction memory _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }



    /// @dev Removes an auction from the list of open auctions.
    /// @param _tokenId - ID of NFT on auction.
    function _removeAuction(uint256 _tokenId) internal {
        for (uint i =0; i<bids[_tokenId].length; i++){
            if (bids[_tokenId][i].bidder != address(0)){
                addressToBid[_tokenId][bids[_tokenId][i].bidder] = 0;
            }
        }

        for (uint256 i=0;i<tokenIds.length; i++){
            if ( tokenIds[i] == _tokenId ){
                delete tokenIds[i];
                break;
            }
        }

        delete bids[_tokenId];
        delete tokenIdToAuction[_tokenId];
    }
}
//hsoy