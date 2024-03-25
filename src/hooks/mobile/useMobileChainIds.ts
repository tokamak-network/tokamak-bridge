import { useMemo } from 'react'

const useChainIds = (connectedNetwork: any) => {
    const ethChainId = useMemo(() => {
        
        //연결이 안되어 있을 때,
        if (!connectedNetwork || typeof connectedNetwork.connectedChainId !== 'number') {
            return 1;
        }
        return connectedNetwork.connectedChainId === 1 || connectedNetwork.connectedChainId === 55004
            ? 1
            : 5;
    }, [connectedNetwork]);
    
    const titanChainId = useMemo(() => {
        
        //연결이 안되어 있을 때,
        if (!connectedNetwork || typeof connectedNetwork.connectedChainId !== 'number') {
            return 55004;
        }
        
        return connectedNetwork.connectedChainId === 1 || connectedNetwork.connectedChainId === 55004
            ? 55004
            : 5050;
    }, [connectedNetwork]);

    
    return { ethChainId, titanChainId };
};

export default useChainIds;