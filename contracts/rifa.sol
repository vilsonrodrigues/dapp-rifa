pragma solidity ^0.7.0;

contract Rifa {
    
    address owner;
    mapping(address => uint) rifasPorPessoa;
    address[] rifas;
    uint valorDaRifa = 0.1 ether;
    address payable winner;
    
    event Sorteio(address winner);
    event RifaComprada(address comprador, uint quant);
    
    constructor();
    
    modifier onlyOwner;
    
    function sacarPremio() external onlyOwner;
    
    function verRifas() public view returns (uint);
    
    function comprarRifa(uint _quant) public payable;
    
    function sortearRifa() public onlyOwner;
    
    function verPremio() public view returns (uint);
    
    function verTotalDeRifas() public view returns (uint);
    
    function verGanhador() public view returns (address);
    
    function verPrecoDaRifa() public view returns (uint);
    
    function isOwner() public view returns (bool);
    
    
}