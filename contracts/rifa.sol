pragma solidity ^0.4.25;

contract Rifa {
    
    address owner;
    mapping(address => uint) rifasPorPessoa;
    address[] rifas;
    uint valorDaRifa = 0.1 ether;
    address winner;
    
    event Sorteio(address winner);
    event RifaComprada(address comprador, uint quant);
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function sacarPremio() external onlyOwner {
        require(msg.sender == winner, "Somente o ganhador do sorteio pode chamar essa função!");
        winner.transfer(address(this).balance / 2);
    }
    
    function verRifas() public view returns (uint) {
        return rifasPorPessoa[msg.sender];
    }
    
    function comprarRifa(uint _quant) public payable {
        require(msg.value == _quant*valorDaRifa);

        for (uint i = 0; i < _quant; i++) {
            rifas.push(msg.sender);
            rifasPorPessoa[msg.sender]++;
        }
        
        emit RifaComprada(msg.sender, _quant);
    }
    
    function sortearRifa() public onlyOwner {
        require(rifas.length >= 1, "Ninguém comprou a rifa ainda !");
        uint random = uint(keccak256(abi.encodePacked(now, msg.sender))) % (rifas.length + 1);
        winner = rifas[random];
        emit Sorteio(winner);
    }
    
    function verPremio() public view returns (uint) {
        return rifas.length*valorDaRifa/2;
    }
    
    function verTotalDeRifas() public view returns (uint) {
        return rifas.length;
    }
    
    function verGanhador() public view returns (address) {
        return winner;
    }
    
    function verPrecoDaRifa() public view returns (uint) {
        return valorDaRifa;
    }
    
    function isOwner() public view returns (bool) {
        if (msg.sender == owner) {
            return true;
        }
        return false;
    }
    
    
}