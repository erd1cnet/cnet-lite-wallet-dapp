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
        id: 'WCNET-8e61de',
        decimal: 18,
        name: 'CyberNetwork',
        icon: wcnet,
        pools: {
            usdc: 'erd1qqqqqqqqqqqqqpgqe4exh0eznlchn98cezw8xlxpqp77uh3674ns3aaqgq',
            cyber: 'erd1qqqqqqqqqqqqqpgql7gash3h2uhsyx0zelc5vld0na4mrhkw74nsqfvnqh',
            usdt: 'erd1qqqqqqqqqqqqqpgq54lh5ajtkval0pvmf778jx3jc242sl0y74ns02kutg',
            wegld: 'erd1qqqqqqqqqqqqqpgq4f2a8hal7mhkq5jlfk5fm3ud568dad6f74nsdq24ex',
            ash: 'erd1qqqqqqqqqqqqqpgqck75fgy60jstucr7v4khcqxysehd2tsd74nsrj0lj5'
        }
    },
    {
        value: 'wegld',
        label: 'WEGLD',
        id: 'WEGLD-4660e8',
        decimal: 18,
        name: 'MultiversX',
        icon: wegld,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq4f2a8hal7mhkq5jlfk5fm3ud568dad6f74nsdq24ex'
        }
    },
    {
        value: 'usdc',
        label: 'USDC',
        id: 'USDC-196479',
        decimal: 18,
        name: 'USDC',
        icon: usdc,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqe4exh0eznlchn98cezw8xlxpqp77uh3674ns3aaqgq'
        }
    },
    {
        value: 'cyber',
        label: 'CYBER',
        name: 'Cyberpunk City',
        decimal: 18,
        id: 'CYBER-c3d822',
        icon: cyber,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgql7gash3h2uhsyx0zelc5vld0na4mrhkw74nsqfvnqh'
        }
    },
    {
        value: 'ash',
        label: 'ASH',
        id: 'ASH-7c7655',
        decimal: 18,
        name: 'ASH',
        icon: ash,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqck75fgy60jstucr7v4khcqxysehd2tsd74nsrj0lj5'
        }
    },
    {
        value: 'usdt',
        label: 'USDT',
        id: 'USDT-f1b51c',
        decimal: 18,
        name: 'USDT',
        icon: usdt,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq54lh5ajtkval0pvmf778jx3jc242sl0y74ns02kutg'
        }
    }
];

export { CRYPTO_CURRENCIES };
