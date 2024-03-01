// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./MamonNFT.sol";
import "./ERC20.sol";


contract Marketplace is AccessControl {

    int maxQuantity = 1;

    struct NFTProd {
        address owner;
        uint256 tokenID;
        uint256 price;
        string paymentMethod;
        uint8 flag;
    }

    bytes32 public constant PRODUCE_ROLE = keccak256("PRODUCE_ROLE");

    mapping (uint256 => NFTProd) public nftSellProds;
    mapping (address => uint256[]) public allowedNFT;

    uint256 [] public sellList;
    mapping (string => uint256[]) public nftIDsByHash;

    MamonNFT mamonNFT;
//    ERC20 fast;
//    ERC20 duke;
    ERC20 mytoken;

    address public feeAddress;
    uint public feePercent;

    event Transfer(address indexed from, address indexed to, uint256 tokenID);
    event Buy(address indexed from, address indexed to, uint256 tokenID, uint256 price, string paymentMethod);
    event RegisterForSale(address indexed from, uint256 tokenID, uint256 price);

//    constructor(MamonNFT _mamonNFT, address _fast, address _duke, uint _fee) {
    constructor(MamonNFT _mamonNFT, address _mytoken, uint _fee) {
        mamonNFT = _mamonNFT;
//        fast = ERC20(address(_fast));
//        duke = ERC20(address(_duke));

        mytoken = ERC20(address(_mytoken));
        feePercent = _fee;
        feeAddress = _msgSender();
        _setupRole(PRODUCE_ROLE, _msgSender());
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }


    function setMaxQuantity(int _quantity) public {
        maxQuantity = _quantity;
    }

    function getMaxQuantity() public view returns(int) {
        return maxQuantity;
    }

    function createNewProduction(string memory _hash, uint256 _quantity) public returns (uint256[] memory) {
        require(hasRole(PRODUCE_ROLE, _msgSender()), "Must have produce role to mint");
        uint256[] memory tokenIDs = new uint256[](_quantity);
        for(uint256 index = 0; index < _quantity; ++index) {
            uint256 _tokenID = mamonNFT.mint(msg.sender, _hash);
            tokenIDs[index] = _tokenID;
        }

        nftIDsByHash[_hash] = tokenIDs;
    }

    function registerForSale(uint256 _tokenID, uint256 _price, string memory _hash, string memory _paymentMethod) public {

        require((mamonNFT.getApproved(_tokenID) == address(this)), "This NFT is not approved for sale");
        require(_price > 0, "The price should be more than 0.");
        nftSellProds[_tokenID] = NFTProd(msg.sender, _tokenID, _price, _paymentMethod, 1);
        sellList.push(_tokenID);
        allowedNFT[msg.sender].push(_tokenID);

        emit RegisterForSale(msg.sender, _tokenID, _price);
    }

    function getNFTIDsByHash(string memory _hash) public view returns(uint256[] memory){
        return nftIDsByHash[_hash];
    }


    function getNFTProdByTokenID(uint256 _tokenId) public view returns(NFTProd memory){
        return nftSellProds[_tokenId];
    }

    function getNFTList() public view returns(uint256[] memory){
        return sellList;
    }

    function getIndexOfNFT(uint256 _tokenID) public view returns(uint){
        uint arrIndex = 0;
        for(uint256 index = 0; index < sellList.length; index++) {
            if(sellList[index] == _tokenID){
                arrIndex = index;
                break;
            }
        }
        return arrIndex;
    }

    function removeItemFromSale(uint256 _tokenID) internal {
        uint index = getIndexOfNFT(_tokenID);
        require(index < sellList.length);
        sellList[index] = sellList[sellList.length-1];
        sellList.pop();
    }

    function getIndexOfUserAllowedNFT(address _guy, uint256 _tokenID) public view returns(uint){
        uint arrIndex = 0;
        for(uint256 index = 0; index < allowedNFT[_guy].length; index++) {
            if(allowedNFT[_guy][index] == _tokenID){
                arrIndex = index;
                break;
            }
        }
        return arrIndex;
    }

    function removeItemFromAllowed(address _guy, uint256 _tokenID) internal {
        uint arrIndex = 0;
        bool isFound = false;
        for(uint256 index = 0; index < allowedNFT[_guy].length; index++) {
            if(allowedNFT[_guy][index] == _tokenID){
                arrIndex = index;
                isFound = true;
                break;
            }
        }

        require(isFound, "can't find allowedNFT");
        allowedNFT[_guy][arrIndex] = allowedNFT[_guy][allowedNFT[_guy].length-1];
        allowedNFT[_guy].pop();
    }

    function buy(uint256 _tokenID, uint256 _amount ) public payable returns (uint256) {
        // require(nftProds[_hash].quantity >= 1, "Must have quantity more than 1");
        require(_amount == nftSellProds[_tokenID].price, "Amount should be same with price");
        // require(fast.transferFrom(msg.sender, address(0x1), _amount), "ERC20: transfer amount exceeds allowance");
        NFTProd memory sellNFT = nftSellProds[_tokenID];

        uint256 feeAmount = nftSellProds[_tokenID].price * feePercent / 10000 ;

        if(keccak256(abi.encodePacked("ETH")) == keccak256(abi.encodePacked(sellNFT.paymentMethod))){
            payable(sellNFT.owner).transfer(msg.value -feeAmount);
            payable(feeAddress).transfer(feeAmount);
        }
        else if(keccak256(abi.encodePacked("MYTOKEN")) == keccak256(abi.encodePacked(sellNFT.paymentMethod))){
            mytoken.transferFrom(msg.sender, sellNFT.owner, _amount - feeAmount);
            mytoken.transferFrom(msg.sender, feeAddress, feeAmount);
        }

//        if(keccak256(abi.encodePacked("BNB")) == keccak256(abi.encodePacked(sellNFT.paymentMethod))){
//            payable(sellNFT.owner).transfer(msg.value -feeAmount);
//            payable(feeAddress).transfer(feeAmount);
//        }
//        else if(keccak256(abi.encodePacked("FAST")) == keccak256(abi.encodePacked(sellNFT.paymentMethod))){
//            fast.transferFrom(msg.sender, sellNFT.owner, _amount - feeAmount);
//            fast.transferFrom(msg.sender, feeAddress, feeAmount);
//        } else if(keccak256(abi.encodePacked("DUKE")) == keccak256(abi.encodePacked(sellNFT.paymentMethod))){
//            duke.transferFrom(msg.sender, sellNFT.owner, _amount - feeAmount);
//            duke.transferFrom(msg.sender, feeAddress, feeAmount);
//        }
        mamonNFT.transferFrom(sellNFT.owner, msg.sender, _tokenID);
        removeItemFromSale(_tokenID);
        removeItemFromAllowed(sellNFT.owner,  _tokenID);

        emit Transfer(sellNFT.owner, msg.sender, _tokenID);
        emit Buy(sellNFT.owner, msg.sender, _tokenID, _amount, sellNFT.paymentMethod);

        return _tokenID;
    }

    //delete NFT from sale
    function removeNFTfromSale (uint256 _tokenID) public {
        require(nftSellProds[_tokenID].owner == _msgSender(), "only nft owner can delete nft");
        removeItemFromSale(_tokenID);
        removeItemFromAllowed(_msgSender(),  _tokenID);
    }

    //set fee precentage
    function setFeeAmount(uint _feeAmount) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Admin only can do this.");
        feePercent = _feeAmount;
    }

    //set fee address
    function setFeeAddress(address _feeAddress) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Admin only can do this.");
        feeAddress = _feeAddress;
    }

}