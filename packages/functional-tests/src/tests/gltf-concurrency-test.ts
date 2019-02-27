/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';

import { Test } from '../test';

export default class GltfConcurrencyTest extends Test {
    public expectedResultDescription = "Cesium man, a bottle, and maybe a gearbox.";

    public async run(): Promise<boolean> {
        const runnerPromise = MRE.Actor.CreateFromGltf(this.app.context, {
            // tslint:disable-next-line:max-line-length
            resourceUrl: `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb`,
            actor: { transform: { position: { x: 0.66, y: -0.72 } } }
        });

        const gearboxPromise = MRE.Actor.CreateFromGltf(this.app.context, {
            // tslint:disable-next-line:max-line-length
            resourceUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF/GearboxAssy.gltf',
            actor: { transform: { position: { x: 16, y: -1.6, z: -1.2 }, scale: { x: 0.1, y: 0.1, z: 0.1 } } }
        });

        const bottlePromise = this.app.context.assetManager.loadGltf('bottle',
            // tslint:disable-next-line:max-line-length
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF/WaterBottle.gltf');

        try {
            await gearboxPromise;
        } catch (e) {
            console.log('Gearbox didn\'t load, as expected in Altspace');
        }

        let runner: MRE.Actor;
        let bottleAsset: MRE.AssetGroup;
        try {
            [runner, bottleAsset] = await Promise.all([runnerPromise, bottlePromise]);
        } catch (errs) {
            console.error(errs);
            return false;
        }

        runner.enableAnimation('animation:0');
        await MRE.Actor.CreateFromPrefab(this.app.context, {
            prefabId: bottleAsset.prefabs.byIndex(0).id,
            actor: { transform: { position: { x: -.66 }, scale: { x: 4, y: 4, z: 4 } } }
        });

        await this.stoppedAsync();
        return true;
    }
}
