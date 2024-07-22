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
        id: 'WCNET-76764a',
        decimal: 18,
        name: 'CyberNetwork',
        icon: wcnet,
        pools: {
            usdc: 'erd1qqqqqqqqqqqqqpgq90czf67nzws8qfm3aqkuhcykvavx9kkd74nszupuf0',
            cyber: 'erd1qqqqqqqqqqqqqpgquzapr6qc206ghy5l2thng7qmx67frtzj74nsg3y5qp',
            usdt: 'erd1qqqqqqqqqqqqqpgqhqyxmm9plvtf5n0nqqh34fh2sxlgx44774ns7flzxk',
            wegld: 'erd1qqqqqqqqqqqqqpgqjnmgcqkguwlrrzpzsunay5kpnt030y5h74nswuamc4',
            ash: 'erd1qqqqqqqqqqqqqpgqzg068jj2fwss2sp8k22djjn6n3pjszgt74nsp9jx6v'
        }
    },
    {
        value: 'wegld',
        label: 'WEGLD',
        id: 'WEGLD-55c029',
        decimal: 18,
        name: 'MultiversX',
        icon: wegld,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqjnmgcqkguwlrrzpzsunay5kpnt030y5h74nswuamc4'
        }
    },
    {
        value: 'usdc',
        label: 'USDC',
        id: 'USDC-88eb45',
        decimal: 18,
        name: 'USDC',
        icon: usdc,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq90czf67nzws8qfm3aqkuhcykvavx9kkd74nszupuf0'
        }
    },
    {
        value: 'cyber',
        label: 'CYBER',
        name: 'Cyberpunk City',
        decimal: 18,
        id: 'CYBER-4c1a56',
        icon: cyber,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgquzapr6qc206ghy5l2thng7qmx67frtzj74nsg3y5qp'
        }
    },
    {
        value: 'ash',
        label: 'ASH',
        id: 'ASH-ae7c97',
        decimal: 18,
        name: 'ASH',
        icon: ash,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqzg068jj2fwss2sp8k22djjn6n3pjszgt74nsp9jx6v'
        }
    },
    {
        value: 'usdt',
        label: 'USDT',
        id: 'USDT-6b28f4',
        decimal: 18,
        name: 'USDT',
        icon: usdt,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqhqyxmm9plvtf5n0nqqh34fh2sxlgx44774ns7flzxk'
        }
    }
];

export { CRYPTO_CURRENCIES };
