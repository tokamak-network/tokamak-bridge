import { Flex, HStack } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { selectedInTokenStatus } from '@/recoil/bridgeSwap/atom';
import { inputTokenAmountOpenedStatus } from '@/recoil/card/selectCard/inputTokenAmount';
import Image from 'next/image';
import TokenInput from '../input/TokenInput';
import Warning from '@/app/BridgeSwap/Warning';

import BgImage from 'assets/image/BridgeSwap/selectTokenCardBg.svg';
import CloseIcon from 'assets/icons/close.svg';

export function InputTokenAmountModal() {
  const [isOpenModal, setOpenModal] = useRecoilState(inputTokenAmountOpenedStatus);
  const ref = useRef<HTMLInputElement>(null);
  const [selectedInToken] = useRecoilState(selectedInTokenStatus);

  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  //close when click at outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (event.target.id === 'out-area') {
        return handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedInToken?.parsedAmount]);

  return (
    <Modal isOpen={isOpenModal} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent
        minW={'100%'}
        maxW={'100%'}
        h="calc(100% - 60px)"
        m={{ base: 'none', lg: 0 }}
        mt={'auto'}
        mb={0}
        p={0}
        bg={{ base: '#1F2128', lg: 'transparent' }}
        overflow={'hidden'}
      >
        <ModalBody
          minW={'100%'}
          maxW={'100%'}
          p={0}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'end'}
          bg={'transparent'}
          id="out-area"
          zIndex={1}
        >
          <Flex
            w={'1362px'}
            h={{ base: '100%', lg: '486px' }}
            bgColor={{ base: '#1F2128', lg: 'transparent' }}
            rounded={'24px 24px 0px 0px'}
            padding={{ base: '16px 10px', lg: 0 }}
            // borderRadius={"150px 150px 0px 0px"}
            rowGap={'17.43px'}
            flexDir={'column'}
            alignItems={'center'}
            backgroundImage={BgImage}
            zIndex={100}
            overflow={{ base: 'hidden' }}
            mb={{ base: 'auto', lg: '0' }}
          >
            <>
              <HStack justifyContent="space-between" w="100%" px="2px">
                <Warning />

                <Image
                  width={20}
                  height={20}
                  src={CloseIcon}
                  alt={'close'}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClose}
                />
              </HStack>

              <Flex w={'full'} justify={'center'} align={'start'} columnGap={'11px'}>
                <TokenInput
                  inToken={true}
                  hasMaxButton={true}
                  customRef={ref}
                  placeholder={'Input amount'}
                  isDisabled={false}
                  defaultValue={selectedInToken?.parsedAmount || ''}
                  onClose={handleClose}
                />
              </Flex>
            </>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
