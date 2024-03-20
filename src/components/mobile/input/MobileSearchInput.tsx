import {
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';

import { useRecoilState } from "recoil";
import { SearchIcon } from '@chakra-ui/icons';
import {
    searchTokenStatus,
    IsSearchToken,
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";

import { useState, useEffect } from "react";

interface MobileSearchInputProps {
    searchValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MobileSearchInput(
    { searchValue, onChange }
    : MobileSearchInputProps
) 
{
    return (
        <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input 
                type="text"
                value={searchValue}
                placeholder="Search token name or address11"
                border="none"
                _focus={{ borderColor: 'none' }}
                bg="blackAlpha.500"
                color="white"
                onChange={onChange}
            />
        </InputGroup>
    )
}