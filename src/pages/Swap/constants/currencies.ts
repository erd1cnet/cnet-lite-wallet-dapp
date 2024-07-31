import cyber from '../../../assets/crypto/cyber.svg';
import wegld from '../../../assets/crypto/wegld.svg';
import usdc from '../../../assets/crypto/usdc.svg';
import usdt from '../../../assets/crypto/usdt.svg';
import wcnet from '../../../assets/crypto/wcnet.svg';
//import cnet from '../../../assets/crypto/cnet.svg';
import ash from '../../../assets/crypto/ash.svg';
import { TokenType } from '../types';


const CRYPTO_CURRENCIES: TokenType[] = [
    {
        value: 'wcnet',
        label: 'WCNET',
        id: 'WCNET-e43344',
        decimal: 18,
        name: 'CyberNetwork',
        icon: wcnet,
        pools: {
            usdc: 'erd1qqqqqqqqqqqqqpgq4vvppmegglmnshwx77he2fqr9zysce6y74nsrsys5g',
            cyber: 'erd1qqqqqqqqqqqqqpgqpak7lvf8weltp2rg7vjzrd5tyum5eaug74ns68pgse',
            usdt: 'erd1qqqqqqqqqqqqqpgqlysxy9kruuxsys7rq84nnkx57mhtszqg74ns5u808j',
            wegld: 'erd1qqqqqqqqqqqqqpgq0mgq0f3gsjlz4zngraxp4plt5xqfgy2k74ns5gkk3j',
            ash: 'erd1qqqqqqqqqqqqqpgq5mu38jhhrxveajq603ekyuxvlh84y53574nsxvlulj'
        }
    },
    {
        value: 'wegld',
        label: 'WEGLD',
        id: 'WEGLD-e3b384',
        decimal: 18,
        name: 'MultiversX',
        icon: wegld,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq0mgq0f3gsjlz4zngraxp4plt5xqfgy2k74ns5gkk3j'
        }
    },
    {
        value: 'usdc',
        label: 'USDC',
        id: 'USDC-ad1552',
        decimal: 18,
        name: 'USDC',
        icon: usdc,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq4vvppmegglmnshwx77he2fqr9zysce6y74nsrsys5g'
        }
    },
    {
        value: 'cyber',
        label: 'CYBER',
        name: 'Cyberpunk City',
        decimal: 18,
        id: 'CYBER-da6784',
        icon: cyber,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqpak7lvf8weltp2rg7vjzrd5tyum5eaug74ns68pgse'
        }
    },
    {
        value: 'ash',
        label: 'ASH',
        id: 'ASH-8232a6',
        decimal: 18,
        name: 'ASH',
        icon: ash,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq5mu38jhhrxveajq603ekyuxvlh84y53574nsxvlulj'
        }
    },
    {
        value: 'usdt',
        label: 'USDT',
        id: 'USDT-5a3a82',
        decimal: 18,
        name: 'USDT',
        icon: usdt,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqlysxy9kruuxsys7rq84nnkx57mhtszqg74ns5u808j'
        }
    }
];

export { CRYPTO_CURRENCIES };
