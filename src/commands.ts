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
import {
  TokenType,
  TurboFactory,
  TurboWallet,
  isTokenType,
  tokenToBaseMap,
} from '@ardrive/turbo-sdk';

const config = {
  paymentServiceConfig: { url: 'https://payment.ardrive.dev' },
  uploadServiceConfig: { url: 'https://upload.ardrive.dev' },
};
export async function getBalance(address: string, token: string) {
  if (!isTokenType(token)) {
    throw new Error('Invalid token type!');
  }

  const unauthenticatedTurbo = TurboFactory.unauthenticated({
    paymentServiceConfig: { token },
  });
  console.log('unauthenticatedTurbo', unauthenticatedTurbo);
  // const balance = await unauthenticatedTurbo.getBalance({
  //   owner: address,
  // });
  console.log('TODO: Get balance for', address);
}

export interface CryptoFundParams {
  token: TokenType;
  amount: string;
  privateKey: TurboWallet;
}
/** Fund the connected signer with crypto */
export async function cryptoFund({
  amount,
  privateKey,
  token,
}: CryptoFundParams) {
  const authenticatedTurbo = TurboFactory.authenticated({
    ...config,
    privateKey: privateKey,
    token,
    gatewayUrl: 'https://api.korellia.kyve.network',
  });

  const result = await authenticatedTurbo.topUpWithTokens({
    tokenAmount: tokenToBaseMap[token](amount),
  });

  console.log(
    'Sent crypto fund transaction: \n',
    JSON.stringify(result, null, 2),
  );
}
