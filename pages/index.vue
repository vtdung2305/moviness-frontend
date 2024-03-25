<script lang="ts" setup>
// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="top">
    <section class="first-view">
      <div class="first-view-slogan">
        <h2>
          動作改善動画を見ながら<br />ひとりひとりの<br />評価を記録できる
        </h2>
        <a href="/signup">無料でお試し</a>
      </div>
      <div class="first-view-image">
        <img
          src="../assets/images/top/fv.png"
          alt="パソコン"
        />
      </div>
    </section>

    <section class="plan">
      <h2>ご利用プラン</h2>
      <div class="plan__area">
        <div class="plan__item">
          <div class="plan__color background-free"></div>
          <div class="plan__group">
            <div class="plan__image">
              <img
                src="../assets/images/top/free.svg"
                alt="フリー"
              />
            </div>
            <div class="plan__text">
              <h3 class="color-free">フリー</h3>
              <p>無料お試し</p>
            </div>
          </div>
          <div class="plan__content">
            <div class="plan__detail">
              <p>配信本数</p>
              <p>3本</p>
            </div>
            <div class="plan__detail">
              <p>利用期間</p>
              <p>90日</p>
            </div>
            <div class="plan__detail">
              <p>登録制限</p>
              <p>
                トレーナー 3人まで<br />
                施設利用者 50人まで<br />
                グループ数 10個まで
              </p>
            </div>
          </div>
        </div>
        <div class="plan__item">
          <div class="plan__color background-lite"></div>
          <div class="plan__group">
            <div class="plan__image">
              <img
                src="../assets/images/top/lite.svg"
                alt="ライト"
              />
            </div>
            <div class="plan__text">
              <h3 class="color-lite">ライト</h3>
              <p>6万円/半年</p>
            </div>
          </div>
          <div class="plan__content">
            <div class="plan__detail">
              <p>配信本数</p>
              <p>6本</p>
            </div>
            <div class="plan__detail">
              <p>利用期間</p>
              <p>180日</p>
            </div>
            <div class="plan__detail">
              <p>登録制限</p>
              <p>
                トレーナー 1人まで<br />
                施設利用者 20人まで<br />
                グループ数 4個まで
              </p>
            </div>
          </div>
        </div>
        <div class="plan__item">
          <div
            class="plan__color background-standard"
          ></div>
          <div class="plan__group">
            <div class="plan__image">
              <img
                src="../assets/images/top/standard.svg"
                alt="スタンダード"
              />
            </div>
            <div class="plan__text">
              <h3 class="color-standard">スタンダード</h3>
              <p>60万円/年</p>
            </div>
          </div>
          <div class="plan__content">
            <div class="plan__detail">
              <p>配信本数</p>
              <p>12本</p>
            </div>
            <div class="plan__detail">
              <p>利用期間</p>
              <p>365日</p>
            </div>
            <div class="plan__detail">
              <p>登録制限</p>
              <p>
                トレーナー 5人まで<br />
                施設利用者 50人まで<br />
                グループ数 10個まで
              </p>
            </div>
          </div>
        </div>
        <div class="plan__item">
          <div class="plan__color background-advance"></div>
          <div class="plan__group">
            <div class="plan__image">
              <img
                src="../assets/images/top/advance.svg"
                alt="アドバンス"
              />
            </div>
            <div class="plan__text">
              <h3 class="color-advance">アドバンス</h3>
              <p>120万円/年</p>
            </div>
          </div>
          <div class="plan__content">
            <div class="plan__detail">
              <p>配信本数</p>
              <p>無制限</p>
            </div>
            <div class="plan__detail">
              <p>利用期間</p>
              <p>365日</p>
            </div>
            <div class="plan__detail">
              <p>登録制限</p>
              <p>
                トレーナー 10人まで<br />
                施設利用者 100人まで<br />
                グループ数 20個まで
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="info" class="info">
      <h2>お問い合わせ</h2>
      <p>
        movinessに関するお問い合わせは、お電話またはメールよりお願いいたします。
      </p>
      <a href="tel:0224-26-9441" class="info__link">
        <div class="info__image">
          <img
            src="../assets/images/top/tel.svg"
            alt="電話"
          />
        </div>
        <h3>電話でお問い合わせ</h3>
        <p>0224-26-9441</p>
      </a>
      <a href="mailto:info@shinseido.jp" class="info__link">
        <div class="info__image">
          <img
            src="../assets/images/top/email.svg"
            alt="メール"
          />
        </div>
        <h3>メールでお問い合わせ</h3>
      </a>
    </section>
    <section class="contact">
      <h2>運営会社について</h2>
      <div class="item">
        <span>会社名</span>
        <span>株式会社信成堂</span>
      </div>
      <div class="item">
        <span>代表者</span>
        <span>我妻 成</span>
      </div>
      <div class="item">
        <span>所在地</span>
        <span>
          〒989-0851 宮城県刈田郡蔵王町曲竹神西４−４
        </span>
      </div>
      <div class="item">
        <span>電話番号</span>
        <span>0224-26-9441</span>
      </div>
      <div class="item">
        <span>資本金</span>
        <span>2,000,000円</span>
      </div>
      <div class="item">
        <span>事業内容</span>
        <span>
          整骨院の運営<br />デイサービス事業所の運営<br />ジムの運営
        </span>
      </div>
      <div class="item">
        <span>ホームページ</span>
        <a href="https://shinseido.jp" target="_blank">
          https://shinseido.jp
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.first-view {
  height: 100vh;
  max-width: 1500px;
  width: 90%;
  margin: 0 auto;
  padding: 128px 0;
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 2048px) {
    height: unset;
  }

  @media screen and (max-width: 912px) {
    height: unset;
  }

  @media screen and (max-width: 540px) {
    flex-direction: column;
    width: 100%;
    padding: unset;
    align-items: center;
    width: 90%;
  }

  &-slogan {
    font-size: min(calc(100vw / 1920px * 64px), 51px);
    font-weight: bold;
    letter-spacing: 0.02em;
    line-height: 1.4;
    display: inline-block;
    flex: 1;

    @media screen and (max-width: 912px) {
      flex: 1;
    }

    @media screen and (max-width: 540px) {
      align-items: center;
      justify-content: center;
      display: flex;
      flex-direction: column;
      margin-bottom: 32px;
    }

    h2 {
      margin-bottom: 58px;

      @media screen and (max-width: 912px) {
        margin-bottom: 24px;
      }

      @media screen and (max-width: 540px) {
        text-align: center;
        margin-top: 40px;
        font-size: 22px;
      }
    }

    > a {
      display: inline-block;
      padding: 14px 64px;
      color: #ffffff;
      font-size: min(calc(100vw / 1920px * 32px), 26px);
      font-weight: 500;
      background: linear-gradient(
        90deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      border-radius: 100vh;
      transition: 0.3s;
      letter-spacing: 0.01em;

      @media screen and (max-width: 540px) {
        font-size: 18px;
        padding: 10px 28px;
      }

      &:hover {
        opacity: 0.6;
        transition: 0.3s;
      }
    }
  }

  &-image {
    display: inline-flex;
    align-items: center;
    flex: 1;

    @media screen and (max-width: 912px) {
      flex: 1;
    }

    @media screen and (max-width: 540px) {
      margin-bottom: 60px;
    }

    img {
      height: auto;

      @media screen and (max-width: 912px) {
        height: unset;
      }
    }
  }
}
.top {
  .plan {
    max-width: 1500px;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 144px;

    @media screen and (max-width: 640px) {
      padding-bottom: 90px;
    }

    & > h2 {
      font-size: min(calc(100vw / 1920px * 48px), 38px);
      font-weight: bold;
      margin-bottom: min(calc(100vw / 1920px * 86px), 68px);
      background: linear-gradient(
        90deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;

      @media screen and (max-width: 640px) {
        margin-bottom: 22px;
        font-size: 22px;
      }
    }

    &__color {
      height: 32px;
      border-radius: 19px 19px 0 0;
      margin-bottom: 38px;

      @media screen and (max-width: 640px) {
        margin-bottom: 20px;
      }
    }
    .background {
      &-free {
        background: linear-gradient(
          90.75deg,
          #46a1b8 14.39%,
          #3e8a9d 90.82%
        );
      }

      &-lite {
        background: linear-gradient(
          90.75deg,
          #4ba798 14.39%,
          #46a092 90.82%
        );
      }

      &-standard {
        background: linear-gradient(
          90.75deg,
          #ec9e78 14.39%,
          #de926d 90.82%
        );
      }

      &-advance {
        background: linear-gradient(
          90.75deg,
          #db707c 14.39%,
          #c5656f 90.82%
        );
      }
    }

    &__area {
      display: flex;
      justify-content: center;
      gap: 2%;

      @media screen and (max-width: 1024px) {
        flex-wrap: wrap;
        column-gap: 4%;
        row-gap: 30px;
      }

      @media screen and (max-width: 640px) {
        flex-direction: column;
        flex-wrap: unset;
        gap: 30px;
      }
    }

    &__item {
      width: 19%;
      border-radius: 19px;
      background-color: #ffffff;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);

      @media screen and (max-width: 1024px) {
        width: 45%;
      }

      @media screen and (max-width: 640px) {
        width: 100%;
      }
    }

    &__group {
      @media screen and (max-width: 640px) {
        display: flex;
        align-items: center;
        gap: 40px;
        width: 85%;
        margin: 0 auto;
      }
    }

    &__image {
      max-width: 36%;
      margin: 0 auto min(calc(100vw / 1920px * 40px), 32px);

      @media screen and (max-width: 640px) {
        max-width: 100px;
        margin: 0 0 20px;
      }

      img {
        margin: 0 auto;
      }
    }

    h3 {
      margin-bottom: min(calc(100vw / 1920px * 20px), 16px);
      font-size: min(calc(100vw / 1920px * 40px), 32px);
      font-weight: 700;
      line-height: 1.4;
      letter-spacing: 0.027em;
      text-align: center;

      @media screen and (max-width: 1024px) {
        font-size: min(calc(100vw / 1024px * 40px), 32px);
      }

      @media screen and (max-width: 640px) {
        margin-bottom: 10px;
        font-size: 22px;
      }

      & + p {
        margin-bottom: min(
          calc(100vw / 1920px * 45px),
          36px
        );
        font-size: min(calc(100vw / 1920px * 32px), 26px);
        font-weight: 700;
        line-height: 1.2;
        text-align: center;

        @media screen and (max-width: 1024px) {
          font-size: min(calc(100vw / 1024px * 32px), 26px);
        }

        @media screen and (max-width: 640px) {
          margin-bottom: 20px;
          font-size: 20px;
        }
      }
    }

    .color {
      &-free {
        color: #277c99;
      }

      &-lite {
        color: #347569;
      }

      &-standard {
        color: #ca6d44;
      }

      &-advance {
        color: #b33b4a;
      }
    }

    &__content {
      width: 85%;
      margin: 0 auto min(calc(100vw / 1920px * 56px), 45px);

      @media screen and (max-width: 640px) {
        margin-bottom: 60px;
      }

      & > p {
        padding: min(calc(100vw / 1920px * 16px), 13px) 0;
        font-size: min(calc(100vw / 1920px * 18px), 14px);
        font-weight: 400;
        line-height: 1.6;
        border-top: solid 1px #d8d8db;
        border-bottom: solid 1px #d8d8db;
        letter-spacing: 0.071em;

        @media screen and (max-width: 640px) {
          padding: 13px 0;
          font-size: 16px;
        }
      }
    }

    &__detail {
      display: flex;
      gap: min(calc(100vw / 1920px * 16px), 13px);
      border-bottom: solid 1px #d8d8db;

      @media screen and (max-width: 640px) {
        gap: 20px;
      }

      &:first-of-type {
        border-top: solid 1px #d8d8db;
      }

      p {
        padding: min(calc(100vw / 1920px * 16px), 13px) 0;
        font-size: min(calc(100vw / 1920px * 17px), 14px);
        font-weight: 400;
        line-height: 1.6;
        letter-spacing: 0.071em;

        @media screen and (max-width: 1024px) {
          padding: min(calc(100vw / 1024px * 16px), 13px) 0;
          font-size: min(calc(100vw / 1024px * 17px), 14px);
        }

        @media screen and (max-width: 640px) {
          padding: 13px 0;
          font-size: 16px;
        }
      }
    }
  }

  .info {
    max-width: 1728px;
    width: 90%;
    margin: 0 auto;
    padding: 51px 0 64px;
    background: linear-gradient(
      90deg,
      #2cabdb 0%,
      #8b9bce 100%
    );
    border-radius: 96px;
    text-align: center;

    @media screen and (max-width: 640px) {
      padding: 40px 0 60px;
      border-radius: 24px;
      text-align: unset;
    }

    & > h2 {
      margin-bottom: 13px;
      color: #ffffff;
      font-size: 38px;
      font-weight: 700;
      line-height: 1.6;

      @media screen and (max-width: 640px) {
        font-size: 22px;
        text-align: center;
      }

      & + p {
        margin-bottom: 19px;
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.8;

        @media screen and (max-width: 640px) {
          width: 85%;
          margin: 0 auto 24px;
          font-size: 16px;
        }
      }
    }

    &__link {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 100vh;
      text-align: left;
      background-color: #ffffff;
      width: 384px;
      height: 102px;
      margin: 0 auto;

      @media screen and (max-width: 640px) {
        width: 85%;
        height: 90px;
      }

      &:first-of-type {
        padding-right: 61px;
        padding-left: 83px;
        margin-bottom: 32px;
        pointer-events: none;

        @media screen and (max-width: 640px) {
          padding-right: 50px;
          padding-left: 64px;
          margin-bottom: 20px;
          pointer-events: auto;
        }
      }

      &:last-of-type {
        padding-right: 45px;
        padding-left: 73px;
        transition: 0.3s;

        @media screen and (max-width: 640px) {
          padding-right: 30px;
          padding-left: 65px;
        }

        &:hover {
          opacity: 0.7;
          transition: 0.3s;
        }
      }

      h3 {
        display: inline-block;
        font-size: 25px;
        font-weight: 700;
        letter-spacing: 0.04em;
        line-height: 1;

        @media screen and (max-width: 640px) {
          font-size: 18px;
        }
      }

      p {
        display: inline-block;
        margin-top: 6px;
        font-size: 19px;
        font-weight: 500;
        letter-spacing: 0.05em;
        line-height: 1;
        text-align: center;

        @media screen and (max-width: 640px) {
          font-size: 18px;
        }
      }
    }

    &__image {
      position: absolute;
      width: 32px;
      top: 50%;
      left: 31px;
      transform: translateY(-50%);

      @media screen and (max-width: 640px) {
        width: 25px;
        left: 28px;
      }
    }
  }

  .contact {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 128px 0;

    @media screen and (max-width: 640px) {
      padding: 90px 0;
    }

    & > h2 {
      font-weight: bold;
      font-size: 32px;
      margin-bottom: 19px;

      @media screen and (max-width: 640px) {
        font-size: 22px;
      }
    }

    & > .item {
      border-top: 1px solid #d8d8db;
      width: 703px;
      padding-top: 13px;
      padding-bottom: 13px;
      display: flex;
      flex-direction: row;

      @media screen and (max-width: 640px) {
        width: 85%;
      }

      &:last-child {
        border-bottom: 1px solid #d8d8db;
      }

      a,
      span {
        text-align: left;

        &:first-child {
          flex: 1;
          padding-left: 56px;

          @media screen and (max-width: 640px) {
            flex: 1.5;
            padding-left: 0;
          }
        }

        &:last-child {
          flex: 3;

          @media screen and (max-width: 640px) {
            flex: 2.5;
          }
        }
      }

      a {
        transition: 0.3s;

        &:hover {
          opacity: 0.7;
          transition: 0.3s;
        }
      }
    }
  }
}
</style>
