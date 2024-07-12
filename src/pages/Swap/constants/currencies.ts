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
        id: 'WCNET-26845d',
        decimal: 18,
        name: 'CyberNetwork',
        icon: wcnet,
        pools: {
            usdc: 'erd1qqqqqqqqqqqqqpgqvyxgfxy3ejpnlhmskkz6220r2djqfgw774nsvr88nf',
            cyber: 'erd1qqqqqqqqqqqqqpgqta7mns2wxqnnmr6ww8m8ngd4hn6ed5px74nsyh59mm',
            usdt: 'erd1qqqqqqqqqqqqqpgqh7cjns2fu3nv8ju2jh3pm29f8m4qefqp74ns5gv9eq',
            wegld: 'erd1qqqqqqqqqqqqqpgq4vy7925jnn8uulh0ph25xt09ckxr4gat74nsgtv3j2',
            ash: 'erd1qqqqqqqqqqqqqpgq66glxlt7d8lt7ttmkf4fwxurj0kru89274nsp0t5zz'
        }
    },
    {
        value: 'wegld',
        label: 'WEGLD',
        id: 'WEGLD-26845d',
        decimal: 18,
        name: 'MultiversX',
        icon: wegld,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq4vy7925jnn8uulh0ph25xt09ckxr4gat74nsgtv3j2'
        }
    },
    {
        value: 'usdc',
        label: 'USDC',
        id: 'USDC-26845d',
        decimal: 6,
        name: 'USDC',
        icon: usdc,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqvyxgfxy3ejpnlhmskkz6220r2djqfgw774nsvr88nf'
        }
    },
    {
        value: 'cyber',
        label: 'CYBER',
        name: 'Cyberpunk City',
        decimal: 18,
        id: 'CYBER-26845d',
        icon: cyber,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqta7mns2wxqnnmr6ww8m8ngd4hn6ed5px74nsyh59mm'
        }
    },
    {
        value: 'ash',
        label: 'ASH',
        id: 'ASH-26845d',
        decimal: 18,
        name: 'ASH',
        icon: ash,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgq66glxlt7d8lt7ttmkf4fwxurj0kru89274nsp0t5zz'
        }
    },
    {
        value: 'usdt',
        label: 'USDT',
        id: 'USDT-26845d',
        decimal: 6,
        name: 'USDT',
        icon: usdt,
        pools: {
            wcnet: 'erd1qqqqqqqqqqqqqpgqh7cjns2fu3nv8ju2jh3pm29f8m4qefqp74ns5gv9eq'
        }
    }
];

export { CRYPTO_CURRENCIES };
