/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { isTokenType, privateKeyFromKyveMnemonic } from '@ardrive/turbo-sdk';
import bs58 from 'bs58';
import { program } from 'commander';
import { readFileSync } from 'fs';

import { cryptoFund, getBalance } from './commands.js';
import { version } from './version.js';

program
  .name('turbo')
  .version(version)
  .description('Turbo CLI')
  .helpCommand(true)
  .exitOverride(() => {
    process.exit(0);
  });

program
  .command('get-balance')
  .description('Get balance of a Turbo address')
  .argument('<string>', 'Address to check')
  .option('-t, --token <type>', 'Token type for address', 'arweave')
  .action((address, options) => {
    getBalance(address, options.token);
  });

program
  .command('top-up')
  .description('Top up a Turbo address')
  .argument('<string>', 'Address to top up')
  .option('-t, --token <type>', 'Token type for address', 'arweave')
  .option('-c, --currency <currency>', 'Currency type to top up with', 'usd')
  .option('-a, --amount <amount>', 'Amount of fiat to top up', '10')
  .action((address, options) => {
    console.log('top-up', address, options.token, options.amount);
  });

program
  .command('crypto-fund')
  .description('Top up a wallet with crypto')
  .option(
    '-w, --wallet-file <wallet>',
    'Wallet file to upload with (JWK.json or ETH Private Key or SOL Secret Key)',
  )
  .option('-m, --mnemonic <phrase>', 'Mnemonic to upload with')
  .option('-t, --token <type>', 'Token type for wallet', 'arweave')
  .option('-a, --amount <amount>', 'Amount of crypto to top up')
  .action(async ({ amount, token, mnemonic, walletFile }) => {
    if (!amount || !token) {
      throw new Error('Amount and token required');
    }

    if (!isTokenType(token)) {
      throw new Error('Invalid token type');
    }

    let privateKey: string | undefined;
    if (mnemonic) {
      if (token === 'kyve') {
        privateKey = await privateKeyFromKyveMnemonic(mnemonic);
      } else {
        throw new Error(
          'mnemonic provided but this token type mnemonic to wallet is not supported',
        );
      }
    }

    if (walletFile) {
      const wallet = JSON.parse(readFileSync(walletFile, 'utf-8'));

      privateKey = token === 'solana' ? bs58.encode(wallet) : wallet;
    }

    if (privateKey === undefined) {
      throw new Error('mnemonic or wallet file required');
    }

    cryptoFund({ privateKey, amount, token });
  });

program
  .command('upload-folder')
  .description('Upload a folder to a Turbo address')
  .argument('<string>', 'Directory to upload')
  .option(
    '-w, --wallet-file <wallet>',
    'Wallet file to upload with (JWK.json or ETH Private Key or SOL Secret Key)',
  )
  .option('-s, --seed-phrase <phrase>', 'Seed phrase to upload with')
  .action((directory, options) => {
    console.log('upload-folder TODO', directory, options);
  });

program.parse(process.argv);
