// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * Minimal Ownable implementation (internal) to avoid external imports.
 * Provides owner(), onlyOwner modifier, transferOwnership and renounceOwnership.
 * Constructor accepts an initial owner address so derived contracts can forward msg.sender.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        require(initialOwner != address(0), "Ownable: initial owner is zero");
        _owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
}

/**
 * @title CertificateVerification
 * @dev Tamper-proof certificate verification system with IPFS integration
 * @notice This contract manages the issuance, verification, and revocation of certificates
 */
contract CertificateVerification is Ownable {
    
    // ==================== ENUMS ====================
    
    /**
     * @dev Certificate status enumeration
     * Unknown: Certificate does not exist
     * Active: Certificate is valid and active
     * Revoked: Certificate has been revoked
     */
    enum CertificateStatus {
        Unknown,
        Active,
        Revoked
    }
    
    // ==================== STRUCTS ====================
    
    /**
     * @dev Certificate metadata structure
     * @param certificateHash SHA-256 hash of the certificate file (stored as hex string)
     * @param ipfsCID IPFS Content Identifier for the certificate file
     * @param studentId Unique identifier for the student
     * @param studentName Name of the student
     * @param issuerAddress Ethereum address of the issuer
     * @param issuedAt Timestamp when the certificate was issued
     * @param status Current status of the certificate
     */
    struct Certificate {
        string certificateHash;    // SHA-256 hash (64 hex characters)
        string ipfsCID;           // IPFS Content Identifier
        string studentId;         // Student unique ID
        string studentName;       // Student full name
        address issuerAddress;    // Address of the issuer
        uint256 issuedAt;        // Timestamp of issuance
        CertificateStatus status; // Current status
    }
    
    // ==================== STATE VARIABLES ====================
    
    mapping(string => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;
    string[] private certificateIds;
    uint256 public totalCertificatesIssued;
    uint256 public totalCertificatesRevoked;
    
    // ==================== EVENTS ====================
    
    /**
     * @dev Emitted when a new certificate is issued
     */
    event CertificateIssued(
        string indexed certificateId,
        string certificateHash,
        string ipfsCID,
        string studentId,
        string studentName,
        address indexed issuerAddress,
        uint256 issuedAt
    );
    
    /**
     * @dev Emitted when a certificate is revoked
     */
    event CertificateRevoked(
        string indexed certificateId,
        address indexed revokedBy,
        uint256 revokedAt
    );
    
    /**
     * @dev Emitted when a certificate is reactivated
     */
    event CertificateActivated(
        string indexed certificateId,
        address indexed activatedBy,
        uint256 activatedAt
    );
    
    /**
     * @dev Emitted when an issuer is added
     */
    event IssuerAdded(
        address indexed issuerAddress,
        address indexed addedBy,
        uint256 addedAt
    );
    
    /**
     * @dev Emitted when an issuer is removed
     */
    event IssuerRemoved(
        address indexed issuerAddress,
        address indexed removedBy,
        uint256 removedAt
    );
    
    // ==================== MODIFIERS ====================
    
    /**
     * @dev Modifier to check if the caller is an authorized issuer or owner
     */
    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner(),
            "Not authorized: Only owner or authorized issuers can perform this action"
        );
        _;
    }
    
    /**
     * @dev Modifier to validate certificate ID is not empty
     */
    modifier validCertificateId(string memory _certificateId) {
        require(
            bytes(_certificateId).length > 0,
            "Invalid certificate ID: Certificate ID cannot be empty"
        );
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * @dev Constructor sets the contract deployer as the owner
     */
    constructor() Ownable(msg.sender) {
        authorizedIssuers[msg.sender] = true;
    }
    
    // ==================== CORE FUNCTIONS ====================
    
    /**
     * @dev Issue a new certificate
     * @param _certificateId Unique identifier for the certificate
     * @param _certificateHash SHA-256 hash of the certificate file (hex string)
     * @param _ipfsCID IPFS Content Identifier
     * @param _studentId Student's unique identifier
     * @param _studentName Student's full name
     * @param _force If true, allows overwriting existing certificates
     * @notice Only authorized issuers can call this function
     * @notice Prevents accidental overwrites unless force is true
     */
    function issueCertificate(
        string memory _certificateId,
        string memory _certificateHash,
        string memory _ipfsCID,
        string memory _studentId,
        string memory _studentName,
        string memory /* _issuerSignature */,
        bool _force
    ) 
        external 
        onlyAuthorizedIssuer
        validCertificateId(_certificateId)
    {
        require(bytes(_certificateHash).length > 0, "Certificate hash cannot be empty");
        require(bytes(_ipfsCID).length > 0, "IPFS CID cannot be empty");
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        require(bytes(_studentName).length > 0, "Student name cannot be empty");
        
        CertificateStatus currentStatus = certificates[_certificateId].status;
        
        if (currentStatus != CertificateStatus.Unknown) {
            require(
                _force,
                "Certificate already exists: Use force=true to overwrite"
            );
        }
        
        certificates[_certificateId] = Certificate({
            certificateHash: _certificateHash,
            ipfsCID: _ipfsCID,
            studentId: _studentId,
            studentName: _studentName,
            issuerAddress: msg.sender,
            issuedAt: block.timestamp,
            status: CertificateStatus.Active
        });
        
        if (currentStatus == CertificateStatus.Unknown) {
            certificateIds.push(_certificateId);
            totalCertificatesIssued++;
        }
        
        emit CertificateIssued(
            _certificateId,
            _certificateHash,
            _ipfsCID,
            _studentId,
            _studentName,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Verify a certificate and return its details
     * @param _certificateId Unique identifier of the certificate to verify
     * @return certificateHash SHA-256 hash of the certificate
     * @return ipfsCID IPFS Content Identifier
     * @return studentId Student's ID
     * @return studentName Student's name
     * @return issuerAddress Address of the issuer
     * @return issuedAt Timestamp of issuance
     * @return status Current status (0=Unknown, 1=Active, 2=Revoked)
     * @notice Anyone can verify a certificate
     */
    function verifyCertificate(string memory _certificateId)
        external
        view
        validCertificateId(_certificateId)
        returns (
            string memory certificateHash,
            string memory ipfsCID,
            string memory studentId,
            string memory studentName,
            address issuerAddress,
            uint256 issuedAt,
            CertificateStatus status
        )
    {
        Certificate memory cert = certificates[_certificateId];
        
        return (
            cert.certificateHash,
            cert.ipfsCID,
            cert.studentId,
            cert.studentName,
            cert.issuerAddress,
            cert.issuedAt,
            cert.status
        );
    }
    
    /**
     * @dev Revoke a certificate
     * @param _certificateId Unique identifier of the certificate to revoke
     * @notice Only authorized issuers can revoke certificates
     * @notice Certificate must exist and be active
     */
    function revokeCertificate(string memory _certificateId)
        external
        onlyAuthorizedIssuer
        validCertificateId(_certificateId)
    {
        Certificate storage cert = certificates[_certificateId];
        
        require(
            cert.status != CertificateStatus.Unknown,
            "Certificate does not exist"
        );
        
        require(
            cert.status == CertificateStatus.Active,
            "Certificate is already revoked"
        );
        
        cert.status = CertificateStatus.Revoked;
        totalCertificatesRevoked++;
        
        emit CertificateRevoked(
            _certificateId,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Activate a previously revoked certificate
     * @param _certificateId Unique identifier of the certificate to activate
     * @notice Only authorized issuers can activate certificates
     * @notice Certificate must exist and be revoked
     */
    function activateCertificate(string memory _certificateId)
        external
        onlyAuthorizedIssuer
        validCertificateId(_certificateId)
    {
        Certificate storage cert = certificates[_certificateId];
        
        require(
            cert.status != CertificateStatus.Unknown,
            "Certificate does not exist"
        );
        
        require(
            cert.status == CertificateStatus.Revoked,
            "Certificate is not revoked"
        );
        
        cert.status = CertificateStatus.Active;
        totalCertificatesRevoked--;
        
        emit CertificateActivated(
            _certificateId,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Check if a certificate is active
     * @param _certificateId Unique identifier of the certificate
     * @return bool True if certificate exists and is active
     */
    function isActive(string memory _certificateId)
        external
        view
        validCertificateId(_certificateId)
        returns (bool)
    {
        return certificates[_certificateId].status == CertificateStatus.Active;
    }
    
    // ==================== ISSUER MANAGEMENT ====================
    
    /**
     * @dev Add a new authorized issuer
     * @param _issuerAddress Address to authorize as an issuer
     * @notice Only the contract owner can add issuers
     */
    function addIssuer(address _issuerAddress) 
        external 
        onlyOwner 
    {
        require(
            _issuerAddress != address(0),
            "Invalid address: Cannot add zero address"
        );
        
        require(
            !authorizedIssuers[_issuerAddress],
            "Address is already an authorized issuer"
        );
        
        authorizedIssuers[_issuerAddress] = true;
        
        emit IssuerAdded(
            _issuerAddress,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Remove an authorized issuer
     * @param _issuerAddress Address to remove from authorized issuers
     * @notice Only the contract owner can remove issuers
     * @notice Cannot remove the owner
     */
    function removeIssuer(address _issuerAddress) 
        external 
        onlyOwner 
    {
        require(
            _issuerAddress != address(0),
            "Invalid address: Cannot remove zero address"
        );
        
        require(
            _issuerAddress != owner(),
            "Cannot remove the contract owner as an issuer"
        );
        
        require(
            authorizedIssuers[_issuerAddress],
            "Address is not an authorized issuer"
        );
        
        authorizedIssuers[_issuerAddress] = false;
        
        emit IssuerRemoved(
            _issuerAddress,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Check if an address is an authorized issuer
     * @param _address Address to check
     * @return bool True if address is an authorized issuer
     */
    function isAuthorizedIssuer(address _address) 
        external 
        view 
        returns (bool) 
    {
        return authorizedIssuers[_address];
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * @dev Get the total number of certificates issued
     * @return uint256 Total count of unique certificates
     */
    function getTotalCertificates() 
        external 
        view 
        returns (uint256) 
    {
        return certificateIds.length;
    }
    
    /**
     * @dev Get certificate ID by index
     * @param _index Index in the certificateIds array
     * @return string Certificate ID at the given index
     */
    function getCertificateIdByIndex(uint256 _index)
        external
        view
        returns (string memory)
    {
        require(_index < certificateIds.length, "Index out of bounds");
        return certificateIds[_index];
    }
    
    /**
     * @dev Get certificate status
     * @param _certificateId Unique identifier of the certificate
     * @return CertificateStatus Current status of the certificate
     */
    function getCertificateStatus(string memory _certificateId)
        external
        view
        validCertificateId(_certificateId)
        returns (CertificateStatus)
    {
        return certificates[_certificateId].status;
    }
    
    /**
     * @dev Get statistics about certificates
     * @return totalIssued Total certificates issued
     * @return totalRevoked Total certificates revoked
     * @return totalActive Total active certificates
     */
    function getStatistics()
        external
        view
        returns (
            uint256 totalIssued,
            uint256 totalRevoked,
            uint256 totalActive
        )
    {
        return (
            totalCertificatesIssued,
            totalCertificatesRevoked,
            totalCertificatesIssued - totalCertificatesRevoked
        );
    }
}
