<script lang="ts" setup>
// composable
const { t } = useLang()

// meta
definePageMeta({
  layout: 'seo-page',
})
</script>

<template>
  <div class="procedure">
    <h2><span>ご利用までの流れ</span></h2>
    <p>
      ｢moviness｣の各種手続きと会員登録の手順について説明します｡
    </p>
    <div class="procedure__flow">
      <a href="/flow-to-procedure">
        各種手続き<br class="none-pc" />について
      </a>
      <a href="/flow-to-registration">
        会員登録<br class="none-pc" />の手順
      </a>
    </div>
    <div class="procedure__content">
      <h3>1.ご利用の流れ</h3>
      <div class="procedure__step">
        <div class="procedure__title">
          <div class="procedure__image">
            <img
              src="../assets/images/flow-to-procedure/procedure-step1.svg"
              alt="ステップ1"
            />
          </div>
          <p>会員登録</p>
        </div>
        <p>
          会員登録の手順に沿って会員登録を行ってください｡
        </p>
        <div class="procedure__arrow">
          <img
            src="../assets/images/flow-to-procedure/procedure-arrow.svg"
            alt="矢印"
          />
        </div>
      </div>
      <div class="procedure__step">
        <div class="procedure__title">
          <div class="procedure__image">
            <img
              src="../assets/images/flow-to-procedure/procedure-step2.svg"
              alt="ステップ2"
            />
          </div>
          <p>利用開始</p>
        </div>
        <p>登録したその日からご利用いただけます｡</p>
      </div>
    </div>
    <div class="procedure__content">
      <h3>2.お支払いについて</h3>
      <p>お支払いにはクレジットカードをご利用できます｡</p>
    </div>
    <div class="procedure__content">
      <h3>3.プランの変更について</h3>
      <p>
        プラン変更は更新時のみとなります｡<br />
        変更したい場合は､プランを更新する際に新しく利用したいプランを選択してください｡
      </p>
    </div>
    <div class="procedure__content">
      <h3>4.キャンセル･解約について</h3>
      <p>キャンセル･解約についての説明が入ります｡</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.procedure {
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
        color: #ffffff;
        background: linear-gradient(
          90deg,
          #2cabdb 0%,
          #8b9bce 100%
        );
      }

      &:last-of-type {
        color: #c2c2c2;
        border: 3px solid #c2c2c2;
        background-color: #ffffff;
      }

      &:hover {
        opacity: 0.6;
        transition: 0.3s;
      }
    }
  }

  &__content {
    margin-bottom: 64px;

    @media screen and (max-width: 1180px) {
      margin-bottom: 48px;
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
        margin-bottom: 16px;
        font-size: 22px;
        line-height: 1;
      }

      & + p {
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

  &__step {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 56px;
    width: 926px;
    padding: 48px 0 60px 73px;
    margin: 0 auto 32px;
    background-color: #ffffff;
    border-radius: 48px;

    @media screen and (max-width: 1180px) {
      flex-direction: column;
      align-items: unset;
      gap: 8px;
      width: 100%;
      padding: 34px 28px 41px 32px;
      margin-bottom: 24px;
    }

    &:last-of-type {
      margin-bottom: 0;

      &::after {
        content: none;
      }
    }

    & > p {
      font-size: 20px;
      font-weight: 400;
      line-height: 1.4;
      letter-spacing: 0.06em;

      @media screen and (max-width: 1180px) {
        font-size: 18px;
        line-height: 1.6;
      }
    }
  }

  &__title {
    display: flex;
    align-items: flex-end;
    gap: 57px;

    @media screen and (max-width: 1180px) {
      gap: 16px;
    }

    & > p {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 0.05em;

      @media screen and (max-width: 1180px) {
        font-size: 20px;
        line-height: 1.4;
      }
    }
  }

  &__arrow {
    position: absolute;
    z-index: 1;
    left: 79px;
    bottom: -48.5px;

    @media screen and (max-width: 1180px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
