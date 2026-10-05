/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   bridge.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: deno <tctoan1024@gmail.com>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/01 10:16:12 by deno              #+#    #+#             */
/*   Updated: 2025/05/01 10:16:12 by deno             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Simplified bridge - only for panorama change detection
class VRTourBridge {
  constructor() {
    this.isInitialized = false;
    this.tour = null;
    this.currentPanorama = null;
    this.lastNotifiedPanoramaId = null; // Track last notified panorama
    this.debounceTimeout = null; // For debouncing

    // Check parent location to determine if we should start muted
    this.isMuted = true;
    try {
      if (window.parent && window.parent.location) {
        this.isMuted = window.parent.location.pathname !== "/app";
      }
    } catch (e) {
      // Cross-origin fallback
    }

    // Wait for tour to be initialized
    this.waitForTour();
  }

  attachAudioHooks() {
    try {
      if (!this.tour || !this.tour.player) return;
      const rootPlayer = this.tour.player.getById("rootPlayer");
      if (rootPlayer && !rootPlayer._hasAudioHook) {
        rootPlayer._hasAudioHook = true;
        const origPlayGlobalAudio = rootPlayer.playGlobalAudio?.bind(rootPlayer);
        if (origPlayGlobalAudio) {
          rootPlayer.playGlobalAudio = (...args) => {
            if (this.isMuted) {
              console.log("Blocking playGlobalAudio because tour is muted");
              return null;
            }
            return origPlayGlobalAudio(...args);
          };
        }
        const origResumeGlobalAudios = rootPlayer.resumeGlobalAudios?.bind(rootPlayer);
        if (origResumeGlobalAudios) {
          rootPlayer.resumeGlobalAudios = (...args) => {
            if (this.isMuted) {
              console.log("Blocking resumeGlobalAudios because tour is muted");
              return null;
            }
            return origResumeGlobalAudios(...args);
          };
        }
      }
    } catch (e) {
      console.warn("Failed to attach audio hooks:", e);
    }
  }

  waitForTour() {
    const checkTour = () => {
      if (window.tour && window.tour.player) {
        this.tour = window.tour;
        // Wait a bit more for tour to be fully initialized
        setTimeout(() => {
          this.initialize();
        }, 500);
      } else {
        setTimeout(checkTour, 100);
      }
    };
    checkTour();
  }

  initialize() {
    if (this.isInitialized) return;

    console.log("VR Tour Bridge initialized");
    this.isInitialized = true;

    // Multiple approaches to detect when tour is ready
    if (this.tour && this.tour.bind && window.TDV && window.TDV.Tour) {
      this.tour.bind(window.TDV.Tour.EVENT_TOUR_LOADED, () => {
        console.log("Tour fully loaded via EVENT_TOUR_LOADED");
        setTimeout(() => {
          this.setupPanoramaChangeListeners();
        }, 100);
      });
    }

    // Also try direct setup after delay
    setTimeout(() => {
      console.log("Attempting direct setup after 2 seconds");
      this.setupPanoramaChangeListeners();
    }, 2000);

    // Alternative approach: poll for tour readiness
    this.pollForTourReady();
  }

  pollForTourReady() {
    let attempts = 0;
    const maxAttempts = 20;

    const checkReady = () => {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}`);

      if (this.tour && this.tour.player) {
        const rootPlayer = this.tour.player.getById("rootPlayer");
        if (rootPlayer) {
          console.log("Tour appears ready via polling");
          this.setupPanoramaChangeListeners();
          return;
        }
      }

      if (attempts < maxAttempts) {
        setTimeout(checkReady, 500);
      } else {
        console.log("Max polling attempts reached");
      }
    };

    setTimeout(checkReady, 1000);
  }

  handlePanoramaChange(event) {
    const playlist = event.source;
    const selectedIndex = playlist.get("selectedIndex");

    if (selectedIndex >= 0) {
      const items = playlist.get("items");
      const currentItem = items[selectedIndex];
      const media = currentItem.get("media");

      const panoramaInfo = {
        id: media.get("id"),
        class: media.get("class"),
        data: media.get("data"),
        label: media.get("data") ? media.get("data").label : null,
        selectedIndex: selectedIndex,
        totalItems: items.length,
        source: "playlistChange",
      };

      this.debouncedNotifyPanoramaChange(panoramaInfo);
    }
  }

  trackCurrentPanoramaFromMedia(event) {
    try {
      const media = event.source;
      if (
        media &&
        media.get &&
        media.get("class") &&
        media.get("class").indexOf("Panorama") !== -1
      ) {
        const panoramaInfo = {
          id: media.get("id"),
          class: media.get("class"),
          data: media.get("data"),
          label: media.get("data") ? media.get("data").label : null,
          source: "mediaShow",
        };

        this.debouncedNotifyPanoramaChange(panoramaInfo);
      }
    } catch (error) {
      console.error("Error tracking panorama from media:", error);
    }
  }

  startPeriodicCheck() {
    setInterval(() => {
      try {
        const rootPlayer = this.tour.player.getById("rootPlayer");
        if (rootPlayer) {
          const mainViewer = rootPlayer.getMainViewer();
          const activeMedia = rootPlayer.getActiveMediaWithViewer(mainViewer);

          if (activeMedia) {
            const currentId = activeMedia.get("id");

            const panoramaInfo = {
              id: currentId,
              class: activeMedia.get("class"),
              data: activeMedia.get("data"),
              label: activeMedia.get("data")
                ? activeMedia.get("data").label
                : null,
              source: "periodicCheck",
            };

            this.debouncedNotifyPanoramaChange(panoramaInfo);
          }
        }
      } catch (error) {
        // Silent fail for periodic check
      }
    }, 2000); // Increased to 2 seconds to reduce frequency
  }

  debouncedNotifyPanoramaChange(panoramaInfo) {
    const key = panoramaInfo.label || panoramaInfo.id;
    // Only notify if the panorama has actually changed
    if (this.lastNotifiedPanoramaId === key) {
      return; // Same panorama, don't notify again
    }
    this.lastNotifiedPanoramaId = key;

    // Clear any existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set a new timeout to debounce rapid changes
    this.debounceTimeout = setTimeout(() => {
      this.notifyPanoramaChange(panoramaInfo);
    }, 200); // 200ms debounce
  }

  setupPanoramaChangeListeners() {
    if (!this.tour || !this.tour.player) {
      console.log("Tour or player not ready");
      return;
    }

    try {
      const rootPlayer = this.tour.player.getById("rootPlayer");
      if (!rootPlayer) {
        console.log("Root player not found, retrying in 500ms");
        setTimeout(() => {
          this.setupPanoramaChangeListeners();
        }, 500);
        return;
      }

      console.log("Setting up panorama change listeners");

      // Method 1: Listen to main playlist changes
      const mainPlaylist = rootPlayer.mainPlayList;
      if (mainPlaylist) {
        mainPlaylist.bind("change", (event) => {
          console.log("Main playlist change detected");
          this.handlePanoramaChange(event);
        });
        console.log("Main playlist listener added");
      }

      // Method 2: Listen to all playlists
      const playlists = rootPlayer.getByClassName("PlayList");
      if (playlists && playlists.length > 0) {
        playlists.forEach((playlist, index) => {
          playlist.bind("change", (event) => {
            console.log(`Playlist ${index} change detected`);
            this.handlePanoramaChange(event);
          });
        });
        console.log(`Added listeners to ${playlists.length} playlists`);
      }

      // Method 3: Listen for media show events
      rootPlayer.bind("mediaShow", (event) => {
        console.log("Media show event detected");
        setTimeout(() => {
          this.trackCurrentPanoramaFromMedia(event);
        }, 100);
      });

      // Method 4: Set up periodic checking
      this.startPeriodicCheck();

      // Notify parent window that bridge is ready
      window.parent.postMessage(
        {
          type: "bridge_ready",
          payload: { message: "Bridge initialized and listeners set up" },
        },
        "*"
      );
    } catch (error) {
      console.error("Error setting up panorama listeners:", error);
      // Retry after delay
      setTimeout(() => {
        this.setupPanoramaChangeListeners();
      }, 1000);
    }
  }

  notifyPanoramaChange(panoramaInfo) {
    this.currentPanorama = panoramaInfo;

    // Send message to parent window
    window.parent.postMessage(
      {
        type: "panorama_change",
        payload: panoramaInfo,
      },
      "*"
    );

    // Also show in console for debugging
    const label = panoramaInfo.label || panoramaInfo.id || "Unknown panorama";
    console.log(
      `Panorama changed to: ${label} (via ${panoramaInfo.source || "unknown"})`
    );
  }

  // Audio Control Functions
  muteAllAudio() {
    this.isMuted = true;
    try {
      if (this.tour && this.tour.player) {
        const rootPlayer = this.tour.player.getById("rootPlayer");
        if (rootPlayer) {
          if (rootPlayer.stopGlobalAudios) rootPlayer.stopGlobalAudios();
          if (rootPlayer.pauseGlobalAudios) rootPlayer.pauseGlobalAudios();
        }
      }
      try {
        const audios = document.querySelectorAll("audio");
        audios.forEach((a) => {
          a.pause();
          a.muted = true;
        });
      } catch (e) {}

      console.log("All audio muted");
      window.parent.postMessage(
        {
          type: "audio_control",
          payload: { action: "muted", success: true },
        },
        "*"
      );
      return true;
    } catch (error) {
      console.error("Error muting audio:", error);
      return false;
    }
  }

  unmuteAllAudio() {
    this.isMuted = false;
    try {
      if (!this.tour || !this.tour.player) {
        console.warn("Tour not ready for audio control");
        return false;
      }

      const rootPlayer = this.tour.player.getById("rootPlayer");
      if (rootPlayer) {
        if (rootPlayer.resumeGlobalAudios) {
          rootPlayer.resumeGlobalAudios();
        }
        const hasCurrentAudios =
          window.currentGlobalAudios &&
          Object.keys(window.currentGlobalAudios).length > 0;
        if (
          !hasCurrentAudios &&
          rootPlayer.playAudioList &&
          window.tour?.audio_921DD13B_851B_752B_41D0_730B1F509F14
        ) {
          rootPlayer.playAudioList(
            [window.tour.audio_921DD13B_851B_752B_41D0_730B1F509F14],
            true
          );
        }
      }
      try {
        const audios = document.querySelectorAll("audio");
        audios.forEach((a) => {
          a.muted = false;
        });
      } catch (e) {}

      console.log("All audio unmuted");
      window.parent.postMessage(
        {
          type: "audio_control",
          payload: { action: "unmuted", success: true },
        },
        "*"
      );
      return true;
    } catch (error) {
      console.error("Error unmuting audio:", error);
      return false;
    }
  }

  // Additional method to stop all audio (stronger than pause)
  stopAllAudio() {
    this.isMuted = true;
    try {
      if (this.tour && this.tour.player) {
        const rootPlayer = this.tour.player.getById("rootPlayer");
        if (rootPlayer) {
          if (rootPlayer.stopGlobalAudios) rootPlayer.stopGlobalAudios();
          if (rootPlayer.pauseGlobalAudios) rootPlayer.pauseGlobalAudios();
        }
      }
      try {
        const audios = document.querySelectorAll("audio");
        audios.forEach((a) => {
          a.pause();
          a.muted = true;
        });
      } catch (e) {}

      console.log("All audio stopped");
      window.parent.postMessage(
        {
          type: "audio_control",
          payload: { action: "stopped", success: true },
        },
        "*"
      );
      return true;
    } catch (error) {
      console.error("Error stopping audio:", error);
      return false;
    }
  }

  // Get current audio state
  getAudioState() {
    try {
      if (!this.tour || !this.tour.player) {
        return { available: false, error: "Tour not ready" };
      }

      const rootPlayer = this.tour.player.getById("rootPlayer");
      if (rootPlayer) {
        // Check if there are any global audios currently playing
        const hasCurrentAudios =
          window.currentGlobalAudios &&
          Object.keys(window.currentGlobalAudios).length > 0;

        const hasPausedAudios =
          window.pausedAudiosLIFO && window.pausedAudiosLIFO.length > 0;

        return {
          available: true,
          hasCurrentAudios,
          hasPausedAudios,
          methods: {
            pauseGlobalAudios:
              typeof rootPlayer.pauseGlobalAudios === "function",
            resumeGlobalAudios:
              typeof rootPlayer.resumeGlobalAudios === "function",
            stopGlobalAudios: typeof rootPlayer.stopGlobalAudios === "function",
          },
        };
      }

      return { available: false, error: "Root player not found" };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }
  // Panorama Navigation Method
  setMediaByName(mediaName) {
    if (!mediaName) return false;
    try {
      if (typeof window.setMediaByName === "function") {
        window.setMediaByName(mediaName);
        return true;
      }
      if (this.tour && typeof this.tour.setMediaByName === "function") {
        this.tour.setMediaByName(mediaName);
        return true;
      }
      if (window.tour && typeof window.tour.setMediaByName === "function") {
        window.tour.setMediaByName(mediaName);
        return true;
      }
      console.warn("Tour or setMediaByName not available yet for:", mediaName);
      return false;
    } catch (err) {
      console.error("Error setting media by name:", err);
      return false;
    }
  }
}

// Initialize the bridge
window.vrTourBridge = new VRTourBridge();

// Listen for messages from parent window
window.addEventListener("message", function (event) {
  if (!event.data) return;

  // Handle panorama switching commands
  if (event.data.type === "set_media" || event.data.type === "show_media") {
    const payload = event.data.payload;
    const mediaName = typeof payload === "string" ? payload : payload?.name;
    if (mediaName && window.vrTourBridge) {
      window.vrTourBridge.setMediaByName(mediaName);
    }
    return;
  }

  // Handle audio control commands
  if (event.data.type === "audio_control_command") {
    const { action } = event.data.payload || {};

    switch (action) {
      case "mute":
        window.vrTourBridge.muteAllAudio();
        break;
      case "unmute":
        window.vrTourBridge.unmuteAllAudio();
        break;
      case "stop":
        window.vrTourBridge.stopAllAudio();
        break;
      case "get_state":
        const state = window.vrTourBridge.getAudioState();
        window.parent.postMessage(
          {
            type: "audio_state_response",
            payload: state,
          },
          "*"
        );
        break;
      default:
        console.warn("Unknown audio control action:", action);
    }
  }
});

window.addEventListener("DOMContentLoaded", function () {
  console.log("3DVista Bridge is ready");
});
