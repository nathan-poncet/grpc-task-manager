/* eslint-disable */

export const protobufPackage = "race";

export interface Race {
  id?: string | undefined;
  name?: string | undefined;
  date?: string | undefined;
  participations?: Participation[] | undefined;
}

export interface Participation {
  carId?: string | undefined;
}

export const RACE_PACKAGE_NAME = "race";
