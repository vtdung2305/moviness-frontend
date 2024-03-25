<script lang="ts" setup>
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="registration">
    <h2><span>ご利用までの流れ</span></h2>
    <p>
      ｢moviness｣の各種手続きと会員登録の手順について説明します｡
    </p>
    <div class="registration__flow">
      <a href="/flow-to-procedure">
        各種手続き<br class="none-pc" />について
      </a>
      <a href="/flow-to-registration">
        会員登録<br class="none-pc" />の手順
      </a>
    </div>
    <p>
      施設代表者による会員登録が必要になります｡以下の手順に従って会員登録ページより会員登録を行ってください｡
    </p>
    <div class="registration__content">
      <h3>1.会員登録ページへ</h3>
      <p>
        画面右上の『会員登録』ボタンをクリックして､施設アカウント登録画面を開きます｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-1.png"
          alt="1.会員登録ページへ"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>2.必要事項の記入</h3>
      <p>
        施設情報､代表者情報､担当者情報､アカウント情報を入力します｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-2-1.png"
          alt="2.必要事項の記入"
        />
      </div>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-2-1.png"
          alt="2.必要事項の記入"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>3.プラン選択</h3>
      <p>
        『アカウント情報』のプラン箇所から､ご利用になりたいプランをお選びください｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-3.png"
          alt="3.プラン選択"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>4.確認画面へ</h3>
      <p>
        プライバシーポリシーをご確認･ご同意の上､チェックボックスをクリックしてください｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-4.png"
          alt="4.確認画面へ"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>5.仮登録</h3>
      <p>
        内容に間違いがなければ『登録する』をクリックしてください｡登録を押すと､ログインIDとして登録したメールアドレスに､本登録のURLが記載されたメールが送られてきます｡<br />
        ※｢メールが届かない｣場合は､迷惑メールフォルダやゴミ箱に自動的に振り分けられている可能性がありますので､一度ご確認いただきますようお願い致します｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-5-1.png"
          alt="5.仮登録"
        />
      </div>
      <p>『閉じる』をクリックします｡</p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-5-2.png"
          alt="5.仮登録"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>6.本登録</h3>
      <p>
        送られてきたメール本文内のURLをクリックしてください｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-6-1.png"
          alt="6.本登録"
        />
      </div>
      <p>
        URLをクリックすると登録完了の画面が開くので『ログイン画面を開く』ボタンをクリックします｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-6-2.png"
          alt="6.本登録"
        />
      </div>
    </div>
    <div class="registration__content">
      <h3>7.ログイン</h3>
      <p>
        ログイン画面から､メールアドレス･パスワードを入力しログインしてください｡
      </p>
      <div class="registration__image">
        <img
          src="../assets/images/flow-to-registration/registration-flow-7.png"
          alt="7.ログイン"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.registration {
  max-width: 990px;
  width: 90%;
  margin: 0 auto;
  padding: 160px 0;

  @media screen and (max-width: 1180px) {
    padding: 89px 0 96px;
  }

  .none-pc {
    display: none;

    @media screen and (max-width: 1180px) {
      display: block;
    }
  }

  h2 {
    margin-bottom: 70px;
    text-align: center;

    @media screen and (max-width: 1180px) {
      margin-bottom: 16px;
    }

    span {
      font-size: 48px;
      font-weight: 700;
      background: linear-gradient(
        90deg,
        #2cabdb 0%,
        #8b9bce 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.6;
      letter-spacing: 0.02em;

      @media screen and (max-width: 1180px) {
        font-size: 32px;
        line-height: 1.8;
      }
    }

    & + p {
      margin-bottom: 56px;
      font-size: 32px;
      font-weight: 400;
      line-height: 1.6;
      letter-spacing: 0.04em;
      text-align: center;

      @media screen and (max-width: 1180px) {
        font-size: 22px;
        margin-bottom: 40px;
        text-align: unset;
      }
    }
  }

  &__flow {
    display: flex;
    gap: 21px;
    align-items: center;
    justify-content: center;
    margin-bottom: 64px;

    @media screen and (max-width: 1180px) {
      gap: 17px;
      margin-bottom: 40px;
    }

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 484px;
      height: 76px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 0.06em;
      border-radius: 20px;
      transition: 0.3s;

      @media screen and (max-width: 1180px) {
        width: 160px;
        height: 64px;
        font-size: 20px;
        line-height: 1.2;
        text-align: center;
      }

      &:first-of-type {
        color: #c2c2c2;
        border: 3px solid #c2c2c2;
        background-color: #ffffff;
      }

      &:last-of-type {
        color: #ffffff;
        background: linear-gradient(
          90deg,
          #2cabdb 0%,
          #8b9bce 100%
        );
      }

      &:hover {
        opacity: 0.6;
        transition: 0.3s;
      }
    }

    & + P {
      margin-bottom: 56px;
      font-size: 22px;
      letter-spacing: 0.04em;
      line-height: 1.6;

      @media screen and (max-width: 1180px) {
        font-size: 18px;
        margin-bottom: 64px;
      }
    }
  }

  &__content {
    margin-bottom: 72px;

    @media screen and (max-width: 1180px) {
      margin-bottom: 64px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 32px;
      font-weight: bold;
      line-height: 1.5;
      letter-spacing: 0.04em;

      @media screen and (max-width: 1180px) {
        font-size: 22px;
        line-height: 1;
      }

      & + p {
        margin-bottom: 16px;
        font-size: 20px;
        line-height: 1.8;
        letter-spacing: 0.06em;

        @media screen and (max-width: 1180px) {
          font-size: 18px;
          line-height: 1.6;
          letter-spacing: 0.07em;
        }
      }
    }
  }

  &__image {
    width: 100%;
    height: auto;

    &:not(:first-of-type) {
      margin-top: 16px;

      @media screen and (max-width: 1180px) {
        margin-top: 8px;
      }
    }

    & + p {
      margin-top: 32px;
    }
  }
}
</style>
