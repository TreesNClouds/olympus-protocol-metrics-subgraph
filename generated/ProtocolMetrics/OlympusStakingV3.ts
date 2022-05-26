// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AuthorityUpdated extends ethereum.Event {
  get params(): AuthorityUpdated__Params {
    return new AuthorityUpdated__Params(this);
  }
}

export class AuthorityUpdated__Params {
  _event: AuthorityUpdated;

  constructor(event: AuthorityUpdated) {
    this._event = event;
  }

  get authority(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class DistributorSet extends ethereum.Event {
  get params(): DistributorSet__Params {
    return new DistributorSet__Params(this);
  }
}

export class DistributorSet__Params {
  _event: DistributorSet;

  constructor(event: DistributorSet) {
    this._event = event;
  }

  get distributor(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class WarmupSet extends ethereum.Event {
  get params(): WarmupSet__Params {
    return new WarmupSet__Params(this);
  }
}

export class WarmupSet__Params {
  _event: WarmupSet;

  constructor(event: WarmupSet) {
    this._event = event;
  }

  get warmup(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OlympusStakingV3__epochResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }

  getLength(): BigInt {
    return this.value0;
  }

  getNumber(): BigInt {
    return this.value1;
  }

  getEnd(): BigInt {
    return this.value2;
  }

  getDistribute(): BigInt {
    return this.value3;
  }
}

export class OlympusStakingV3__warmupInfoResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: boolean;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    return map;
  }

  getDeposit(): BigInt {
    return this.value0;
  }

  getGons(): BigInt {
    return this.value1;
  }

  getExpiry(): BigInt {
    return this.value2;
  }

  getLock(): boolean {
    return this.value3;
  }
}

export class OlympusStakingV3 extends ethereum.SmartContract {
  static bind(address: Address): OlympusStakingV3 {
    return new OlympusStakingV3("OlympusStakingV3", address);
  }

  OHM(): Address {
    let result = super.call("OHM", "OHM():(address)", []);

    return result[0].toAddress();
  }

  try_OHM(): ethereum.CallResult<Address> {
    let result = super.tryCall("OHM", "OHM():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  authority(): Address {
    let result = super.call("authority", "authority():(address)", []);

    return result[0].toAddress();
  }

  try_authority(): ethereum.CallResult<Address> {
    let result = super.tryCall("authority", "authority():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  claim(_to: Address, _rebasing: boolean): BigInt {
    let result = super.call("claim", "claim(address,bool):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromBoolean(_rebasing)
    ]);

    return result[0].toBigInt();
  }

  try_claim(_to: Address, _rebasing: boolean): ethereum.CallResult<BigInt> {
    let result = super.tryCall("claim", "claim(address,bool):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromBoolean(_rebasing)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  distributor(): Address {
    let result = super.call("distributor", "distributor():(address)", []);

    return result[0].toAddress();
  }

  try_distributor(): ethereum.CallResult<Address> {
    let result = super.tryCall("distributor", "distributor():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  epoch(): OlympusStakingV3__epochResult {
    let result = super.call(
      "epoch",
      "epoch():(uint256,uint256,uint256,uint256)",
      []
    );

    return new OlympusStakingV3__epochResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_epoch(): ethereum.CallResult<OlympusStakingV3__epochResult> {
    let result = super.tryCall(
      "epoch",
      "epoch():(uint256,uint256,uint256,uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new OlympusStakingV3__epochResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  forfeit(): BigInt {
    let result = super.call("forfeit", "forfeit():(uint256)", []);

    return result[0].toBigInt();
  }

  try_forfeit(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("forfeit", "forfeit():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  gOHM(): Address {
    let result = super.call("gOHM", "gOHM():(address)", []);

    return result[0].toAddress();
  }

  try_gOHM(): ethereum.CallResult<Address> {
    let result = super.tryCall("gOHM", "gOHM():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  index(): BigInt {
    let result = super.call("index", "index():(uint256)", []);

    return result[0].toBigInt();
  }

  try_index(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("index", "index():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  rebase(): BigInt {
    let result = super.call("rebase", "rebase():(uint256)", []);

    return result[0].toBigInt();
  }

  try_rebase(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("rebase", "rebase():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  sOHM(): Address {
    let result = super.call("sOHM", "sOHM():(address)", []);

    return result[0].toAddress();
  }

  try_sOHM(): ethereum.CallResult<Address> {
    let result = super.tryCall("sOHM", "sOHM():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  secondsToNextEpoch(): BigInt {
    let result = super.call(
      "secondsToNextEpoch",
      "secondsToNextEpoch():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_secondsToNextEpoch(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "secondsToNextEpoch",
      "secondsToNextEpoch():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  stake(
    _to: Address,
    _amount: BigInt,
    _rebasing: boolean,
    _claim: boolean
  ): BigInt {
    let result = super.call(
      "stake",
      "stake(address,uint256,bool,bool):(uint256)",
      [
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromBoolean(_rebasing),
        ethereum.Value.fromBoolean(_claim)
      ]
    );

    return result[0].toBigInt();
  }

  try_stake(
    _to: Address,
    _amount: BigInt,
    _rebasing: boolean,
    _claim: boolean
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "stake",
      "stake(address,uint256,bool,bool):(uint256)",
      [
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromBoolean(_rebasing),
        ethereum.Value.fromBoolean(_claim)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  supplyInWarmup(): BigInt {
    let result = super.call("supplyInWarmup", "supplyInWarmup():(uint256)", []);

    return result[0].toBigInt();
  }

  try_supplyInWarmup(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "supplyInWarmup",
      "supplyInWarmup():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  unstake(
    _to: Address,
    _amount: BigInt,
    _trigger: boolean,
    _rebasing: boolean
  ): BigInt {
    let result = super.call(
      "unstake",
      "unstake(address,uint256,bool,bool):(uint256)",
      [
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromBoolean(_trigger),
        ethereum.Value.fromBoolean(_rebasing)
      ]
    );

    return result[0].toBigInt();
  }

  try_unstake(
    _to: Address,
    _amount: BigInt,
    _trigger: boolean,
    _rebasing: boolean
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "unstake",
      "unstake(address,uint256,bool,bool):(uint256)",
      [
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromUnsignedBigInt(_amount),
        ethereum.Value.fromBoolean(_trigger),
        ethereum.Value.fromBoolean(_rebasing)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  unwrap(_to: Address, _amount: BigInt): BigInt {
    let result = super.call("unwrap", "unwrap(address,uint256):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromUnsignedBigInt(_amount)
    ]);

    return result[0].toBigInt();
  }

  try_unwrap(_to: Address, _amount: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("unwrap", "unwrap(address,uint256):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromUnsignedBigInt(_amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  warmupInfo(param0: Address): OlympusStakingV3__warmupInfoResult {
    let result = super.call(
      "warmupInfo",
      "warmupInfo(address):(uint256,uint256,uint256,bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new OlympusStakingV3__warmupInfoResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBoolean()
    );
  }

  try_warmupInfo(
    param0: Address
  ): ethereum.CallResult<OlympusStakingV3__warmupInfoResult> {
    let result = super.tryCall(
      "warmupInfo",
      "warmupInfo(address):(uint256,uint256,uint256,bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new OlympusStakingV3__warmupInfoResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBoolean()
      )
    );
  }

  warmupPeriod(): BigInt {
    let result = super.call("warmupPeriod", "warmupPeriod():(uint256)", []);

    return result[0].toBigInt();
  }

  try_warmupPeriod(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("warmupPeriod", "warmupPeriod():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  wrap(_to: Address, _amount: BigInt): BigInt {
    let result = super.call("wrap", "wrap(address,uint256):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromUnsignedBigInt(_amount)
    ]);

    return result[0].toBigInt();
  }

  try_wrap(_to: Address, _amount: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("wrap", "wrap(address,uint256):(uint256)", [
      ethereum.Value.fromAddress(_to),
      ethereum.Value.fromUnsignedBigInt(_amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _ohm(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _sOHM(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _gOHM(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _epochLength(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _firstEpochNumber(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _firstEpochTime(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _authority(): Address {
    return this._call.inputValues[6].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimCall extends ethereum.Call {
  get inputs(): ClaimCall__Inputs {
    return new ClaimCall__Inputs(this);
  }

  get outputs(): ClaimCall__Outputs {
    return new ClaimCall__Outputs(this);
  }
}

export class ClaimCall__Inputs {
  _call: ClaimCall;

  constructor(call: ClaimCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _rebasing(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class ClaimCall__Outputs {
  _call: ClaimCall;

  constructor(call: ClaimCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ForfeitCall extends ethereum.Call {
  get inputs(): ForfeitCall__Inputs {
    return new ForfeitCall__Inputs(this);
  }

  get outputs(): ForfeitCall__Outputs {
    return new ForfeitCall__Outputs(this);
  }
}

export class ForfeitCall__Inputs {
  _call: ForfeitCall;

  constructor(call: ForfeitCall) {
    this._call = call;
  }
}

export class ForfeitCall__Outputs {
  _call: ForfeitCall;

  constructor(call: ForfeitCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class RebaseCall extends ethereum.Call {
  get inputs(): RebaseCall__Inputs {
    return new RebaseCall__Inputs(this);
  }

  get outputs(): RebaseCall__Outputs {
    return new RebaseCall__Outputs(this);
  }
}

export class RebaseCall__Inputs {
  _call: RebaseCall;

  constructor(call: RebaseCall) {
    this._call = call;
  }
}

export class RebaseCall__Outputs {
  _call: RebaseCall;

  constructor(call: RebaseCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class SetAuthorityCall extends ethereum.Call {
  get inputs(): SetAuthorityCall__Inputs {
    return new SetAuthorityCall__Inputs(this);
  }

  get outputs(): SetAuthorityCall__Outputs {
    return new SetAuthorityCall__Outputs(this);
  }
}

export class SetAuthorityCall__Inputs {
  _call: SetAuthorityCall;

  constructor(call: SetAuthorityCall) {
    this._call = call;
  }

  get _newAuthority(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAuthorityCall__Outputs {
  _call: SetAuthorityCall;

  constructor(call: SetAuthorityCall) {
    this._call = call;
  }
}

export class SetDistributorCall extends ethereum.Call {
  get inputs(): SetDistributorCall__Inputs {
    return new SetDistributorCall__Inputs(this);
  }

  get outputs(): SetDistributorCall__Outputs {
    return new SetDistributorCall__Outputs(this);
  }
}

export class SetDistributorCall__Inputs {
  _call: SetDistributorCall;

  constructor(call: SetDistributorCall) {
    this._call = call;
  }

  get _distributor(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetDistributorCall__Outputs {
  _call: SetDistributorCall;

  constructor(call: SetDistributorCall) {
    this._call = call;
  }
}

export class SetWarmupLengthCall extends ethereum.Call {
  get inputs(): SetWarmupLengthCall__Inputs {
    return new SetWarmupLengthCall__Inputs(this);
  }

  get outputs(): SetWarmupLengthCall__Outputs {
    return new SetWarmupLengthCall__Outputs(this);
  }
}

export class SetWarmupLengthCall__Inputs {
  _call: SetWarmupLengthCall;

  constructor(call: SetWarmupLengthCall) {
    this._call = call;
  }

  get _warmupPeriod(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetWarmupLengthCall__Outputs {
  _call: SetWarmupLengthCall;

  constructor(call: SetWarmupLengthCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _rebasing(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _claim(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ToggleLockCall extends ethereum.Call {
  get inputs(): ToggleLockCall__Inputs {
    return new ToggleLockCall__Inputs(this);
  }

  get outputs(): ToggleLockCall__Outputs {
    return new ToggleLockCall__Outputs(this);
  }
}

export class ToggleLockCall__Inputs {
  _call: ToggleLockCall;

  constructor(call: ToggleLockCall) {
    this._call = call;
  }
}

export class ToggleLockCall__Outputs {
  _call: ToggleLockCall;

  constructor(call: ToggleLockCall) {
    this._call = call;
  }
}

export class UnstakeCall extends ethereum.Call {
  get inputs(): UnstakeCall__Inputs {
    return new UnstakeCall__Inputs(this);
  }

  get outputs(): UnstakeCall__Outputs {
    return new UnstakeCall__Outputs(this);
  }
}

export class UnstakeCall__Inputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _trigger(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _rebasing(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }
}

export class UnstakeCall__Outputs {
  _call: UnstakeCall;

  constructor(call: UnstakeCall) {
    this._call = call;
  }

  get amount_(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class UnwrapCall extends ethereum.Call {
  get inputs(): UnwrapCall__Inputs {
    return new UnwrapCall__Inputs(this);
  }

  get outputs(): UnwrapCall__Outputs {
    return new UnwrapCall__Outputs(this);
  }
}

export class UnwrapCall__Inputs {
  _call: UnwrapCall;

  constructor(call: UnwrapCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UnwrapCall__Outputs {
  _call: UnwrapCall;

  constructor(call: UnwrapCall) {
    this._call = call;
  }

  get sBalance_(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class WrapCall extends ethereum.Call {
  get inputs(): WrapCall__Inputs {
    return new WrapCall__Inputs(this);
  }

  get outputs(): WrapCall__Outputs {
    return new WrapCall__Outputs(this);
  }
}

export class WrapCall__Inputs {
  _call: WrapCall;

  constructor(call: WrapCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class WrapCall__Outputs {
  _call: WrapCall;

  constructor(call: WrapCall) {
    this._call = call;
  }

  get gBalance_(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}
