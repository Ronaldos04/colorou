const ITEM_HEIGHT = 50;

    const startScreen =
      document.getElementById(
        "start-screen"
      );

    const show =
      document.getElementById(
        "show"
      );

    const showCat =
      document.getElementById(
        "show-cat"
      );

    const welcomeCopy =
      document.getElementById(
        "welcome-copy"
      );

    const gameStage =
      document.getElementById(
        "game-stage"
      );

    const countdown =
      document.getElementById(
        "countdown"
      );

    const countdownNumber =
      document.getElementById(
        "countdown-number"
      );

    const redStrip =
      document.getElementById(
        "red-strip"
      );

    const greenStrip =
      document.getElementById(
        "green-strip"
      );

    const blueStrip =
      document.getElementById(
        "blue-strip"
      );

    const rollButton =
      document.getElementById(
        "roll-button"
      );

    const revealBlack =
      document.getElementById(
        "reveal-black"
      );

    const colorReveal =
      document.getElementById(
        "color-reveal"
      );

    const revealRGB =
      document.getElementById(
        "reveal-rgb"
      );

    const picturesMessage =
      document.getElementById(
        "pictures-message"
      );

    const audioFiles = {
      timer: "timer.mp3",
      button: "button.mp3",
      tick: "reel-tick.mp3",
      landing: "reel-land.mp3",
      swoosh: "slow-swoosh.mp3"
    };

    let audioContext = null;
    const audioBuffers = {};

    async function initializeAudio() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const entries = Object.entries(audioFiles);

      await Promise.all(
        entries.map(
          async ([name, url]) => {
            if (audioBuffers[name]) {
              return;
            }

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);
          }
        )
      );
    }

    function playSound(
      name,
      playbackRate = 1,
      volume = 1
    ) {
      if (!audioContext || !audioBuffers[name]) {
        return;
      }

      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();

      source.buffer = audioBuffers[name];
      source.playbackRate.value = playbackRate;
      gain.gain.value = volume;

      source.connect(gain);
      gain.connect(audioContext.destination);
      source.start(0);
    }

    let showStarted = false;

   startScreen.addEventListener(
      "click",
      () => {
        initializeAudio();
        startShow();
      }
    );

    function startShow() {

      if (showStarted) {
        return;
      }

      showStarted = true;

      startScreen.classList.add(
        "hidden"
      );

      show.classList.add(
        "active"
      );

      setTimeout(
        () => {

          welcomeCopy.classList.add(
            "visible"
          );

        },
        250
      );

      setTimeout(
        () => {

          beginMachineEntrance();

        },
        3000
      );

    }

    function beginMachineEntrance() {

      welcomeCopy.classList.add(
        "leaving"
      );

      showCat.classList.add(
        "game-position"
      );

      setTimeout(
        () => {

          gameStage.classList.add(
            "visible"
          );

        },
        300
      );

      setTimeout(
        () => {

          startCountdown();

        },
        2400
      );

    }

    function showCountdownNumber(
      number
    ) {

      countdownNumber.textContent =
        number;

      countdownNumber.classList.remove(
        "pop"
      );

      void countdownNumber.offsetWidth;

      countdownNumber.classList.add(
        "pop"
      );

    }

    function startCountdown() {

      countdown.classList.add(
        "active"
      );

      showCountdownNumber(3);

      playSound(
        "timer",
        1,
        0.38
      );

      setTimeout(
        () => {

          showCountdownNumber(2);

        },
        1000
      );

      setTimeout(
        () => {

          showCountdownNumber(1);

        },
        2000
      );

      setTimeout(
        () => {

          countdown.classList.remove(
            "active"
          );

          playSound(
            "button",
            1,
            0.58
          );

          rollButton.classList.add(
            "pressed"
          );

          setTimeout(
            () => {

              rollButton.classList.remove(
                "pressed"
              );

              setTimeout(
                () => {

                  spinRGB();

                },
                80
              );

            },
            180
          );

        },
        3000
      );

    }

    function randomRGB() {

      return Math.floor(
        Math.random() * 256
      );

    }

    function formatNumber(
      number
    ) {

      return String(number)
        .padStart(
          3,
          "0"
        );

    }

    function buildReel(
      strip,
      finalNumber
    ) {

      strip.innerHTML = "";

      const values = [];

      values.push(
        randomRGB(),
        randomRGB(),
        randomRGB()
      );

      for (
        let i = 0;
        i < 55;
        i++
      ) {

        values.push(
          randomRGB()
        );

      }

      values.push(
        finalNumber
      );

      values.push(
        randomRGB()
      );

      values.forEach(
        value => {

          const number =
            document.createElement(
              "div"
            );

          number.className =
            "reel-number";

          number.textContent =
            formatNumber(
              value
            );

          strip.appendChild(
            number
          );

        }
      );

      return values.length;

    }

    function spinReel(
      strip,
      finalNumber,
      fastSpinDuration,
      onFinished
    ) {

      const itemCount =
        buildReel(
          strip,
          finalNumber
        );

      const finalIndex =
        itemCount - 2;

      const finalPosition =
        50 -
        (
          finalIndex *
          ITEM_HEIGHT
        );

      let position = 50;

      let velocity = 38;

      const startTime =
        performance.now();

      let lastTickTime = 0;

      function maybePlayTick(
        now,
        progress = 0
      ) {

        const minimumGap =
          70 +
          (
            progress *
            155
          );

        if (
          now - lastTickTime >=
          minimumGap
        ) {

          lastTickTime = now;

          const rate =
            1.06 -
            (
              progress *
              0.16
            );

          const volume =
            0.20 +
            (
              progress *
              0.10
            );

          playSound(
            "tick",
            rate,
            volume
          );

        }

      }

      function fastSpin(now) {

        const elapsed =
          now - startTime;

        position += velocity;

        if (
          position > 0
        ) {

          position -= 1000;

        }

        strip.style.transform =
          `translateY(${position}px)`;

        strip.style.filter =
          "blur(1.6px)";

        maybePlayTick(
          now,
          0
        );

        if (
          elapsed <
          fastSpinDuration
        ) {

          requestAnimationFrame(
            fastSpin
          );

        }

        else {

          beginLanding();

        }

      }

      function beginLanding() {

        const landingStart =
          position;

        const landingDuration =
          1800;

        const landingStartTime =
          performance.now();

        function land(now) {

          const elapsed =
            now -
            landingStartTime;

          let progress =
            elapsed /
            landingDuration;

          if (
            progress > 1
          ) {

            progress = 1;

          }

          maybePlayTick(
            now,
            progress
          );

          const eased =
            1 -
            Math.pow(
              1 - progress,
              3
            );

          const currentPosition =
            landingStart +
            (
              finalPosition -
              landingStart
            ) *
            eased;

          strip.style.transform =
            `translateY(${currentPosition}px)`;

          const blur =
            1.6 *
            (
              1 - progress
            );

          strip.style.filter =
            `blur(${blur}px)`;

          if (
            progress < 1
          ) {

            requestAnimationFrame(
              land
            );

          }

          else {

            settle();

          }

        }

        requestAnimationFrame(
          land
        );

      }

      function settle() {

        playSound(
          "landing",
          0.94,
          0.48
        );

        strip.style.transition =
          "transform 120ms ease-out";

        strip.style.transform =
          `translateY(${finalPosition + 5}px)`;

        setTimeout(
          () => {

            strip.style.transition =
              "transform 130ms ease-in-out";

            strip.style.transform =
              `translateY(${finalPosition}px)`;

            strip.style.filter =
              "blur(0px)";

            setTimeout(
              () => {

                strip.style.transition =
                  "none";

                if (
                  onFinished
                ) {

                  onFinished();

                }

              },
              150
            );

          },
          120
        );

      }

      strip.style.transition =
        "none";

      requestAnimationFrame(
        fastSpin
      );

    }

    function spinRGB() {

      const finalRed =
        randomRGB();

      const finalGreen =
        randomRGB();

      const finalBlue =
        randomRGB();

      spinReel(
        redStrip,
        finalRed,
        1900
      );

      spinReel(
        greenStrip,
        finalGreen,
        2600
      );

      spinReel(
        blueStrip,
        finalBlue,
        3300,

        function() {

          console.log(
            "RGB:",
            finalRed,
            finalGreen,
            finalBlue
          );

          setTimeout(
            () => {

              const finalColor =
                `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;

              colorReveal.style.background =
                finalColor;

              revealRGB.textContent =
                `RGB(${finalRed}, ${finalGreen}, ${finalBlue})`;

              revealBlack.classList.add(
                "active"
              );

              setTimeout(
                () => {

                  revealRGB.classList.add(
                    "active"
                  );

                },
                900
              );

              setTimeout(
                () => {

                  colorReveal.classList.add(
                    "dot"
                  );

                },
                1900
              );

              setTimeout(
                () => {

                  playSound(
                    "swoosh",
                    1,
                    0.32
                  );

                  colorReveal.classList.add(
                    "active"
                  );

                  setTimeout(
                    () => {

                      picturesMessage.classList.add(
                        "active"
                      );

                    },
                    550
                  );

                },
                2350
              );

            },
            700
          );

        }
      );

    }
