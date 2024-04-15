import { useMemo } from 'react'

const useChainIds = (connectedNetwork: any) => {
    const ethChainId = useMemo(() => {
        
        //연결이 안되어 있을 때,
        // if (!connectedNetwork || typeof connectedNetwork.connectedChainId !== 'number') {
        //     return 1;
        // }
        // console.log(connectedNetwork.connectedChainId)
        // return connectedNetwork.connectedChainId === 1 || connectedNetwork.connectedChainId === 55004
        //     ? 1
        //     : 5;
        //현재 testnet이 없으므로, return 1 고정 추후 세폴리아로 바꾼다.
        return 1
    }, [connectedNetwork]);
    
    const titanChainId = useMemo(() => {
        
        //연결이 안되어 있을 때,
        // if (!connectedNetwork || typeof connectedNetwork.connectedChainId !== 'number') {
        //     return 55004;
        // }
        
        // return connectedNetwork.connectedChainId === 1 || connectedNetwork.connectedChainId === 55004
        //     ? 55004
        //     : 5050;

        //현재 testnet이 없으므로, return 55004 고정 추후 세폴리아로 바꾼다.
        return 55004
    }, [connectedNetwork]);

    
    return { ethChainId, titanChainId };
};

export default useChainIds;