import { LocationProvider } from "./types"

export const prototypeLocationProvider: LocationProvider = {
  async getCurrentLocation() {
    await new Promise((resolve) => window.setTimeout(resolve, 850))
    return {
      ok: true,
      location: {
        label: "Current location near South National Highway, San Manuel",
        barangay: "San Manuel",
        latitude: 9.7601,
        longitude: 118.7473,
        precisionShared: true,
      },
    }
  },
}
