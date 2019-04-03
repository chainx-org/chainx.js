@chainx/keystore
====

@chainx/keystore encode private key to json format data with passphrase and decode json data to private key 
with passphrase.

## How to use

```javascript
import KeyStore from '@chainx/keystore'

const privateKey = '0xa3fd913a9606bb71b04e74ee6afe69b4154782cfc47c9076d041c7a4ab11cf9e'
const passphrase = '123456'

const json = KeyStore.encrypt(privateKey, passphrase)
const decodedPrivateKey = KeyStore.decrypt(json, passphrase) // equal to privateKey
```

The json format is as follows

```json
{
  "iv": [229, 40, 42, 188, 246, 119, 48, 74, 162, 121, 45, 167, 234, 9, 157, 254],
  "mac": [
    157, 166, 237, 84, 143, 60, 166, 156, 187, 137, 145, 106, 93, 239, 47, 220, 164, 10, 92, 105, 54, 105, 106, 31, 247,
    133, 117, 198, 220, 19, 58, 47
  ],
  "salt": [
    4, 153, 246, 15, 71, 62, 109, 9, 123, 33, 226, 248, 71, 45, 237, 213, 3, 135, 117, 244, 64, 184, 222, 221, 4, 205,
    218, 200, 9, 105, 134, 50
  ],
  "ciphertext": [
    212, 117, 246, 80, 62, 140, 46, 69, 155, 242, 117, 159, 0, 22, 128, 238, 123, 141, 118, 192, 113, 4, 78, 251, 246,
    149, 16, 11, 185, 236, 218, 232
  ],
  "iterations": 10240
}
```
