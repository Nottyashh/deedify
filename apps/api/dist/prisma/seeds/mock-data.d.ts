export declare const mockData: {
    users: ({
        email: string;
        role: "INVESTOR";
        walletAddress: string;
        kycStatus: "VERIFIED";
    } | {
        email: string;
        role: "LISTER";
        walletAddress: string;
        kycStatus: "VERIFIED";
    } | {
        email: string;
        role: "INVESTOR";
        walletAddress: string;
        kycStatus: "PENDING";
    } | {
        email: string;
        role: "ADMIN";
        walletAddress: string;
        kycStatus: "VERIFIED";
    })[];
    listings: ({
        title: string;
        description: string;
        locationText: string;
        geoJson: {
            type: string;
            coordinates: number[][][];
        };
        parcelSize: number;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string;
        totalShares: number;
        pricePerShare: number;
        status: "LIVE";
        collectionMint: string;
    } | {
        title: string;
        description: string;
        locationText: string;
        geoJson: {
            type: string;
            coordinates: number[][][];
        };
        parcelSize: number;
        coordinatePolicy: boolean;
        coordinatePolicyNote: string;
        totalShares: number;
        pricePerShare: number;
        status: "PENDING";
        collectionMint?: undefined;
    })[];
};
