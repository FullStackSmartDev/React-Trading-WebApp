import BalanceSheetStrengthImage from "../static/balance-sheet-strength.png";
import CashKingsImage from "../static/cash-kings.png";
import EarningsYieldImage from "../static/earnings-yield.png";
import FourStarsImage from "../static/four-stars.png";
import InsiderOwnershipImage from "../static/insider-ownership.png";
import MoversAndShakersImage from "../static/movers-and-shakers.png";
import RealBuybacksImage from "../static/real-buybacks.png";
import RecentlyListedImage from "../static/recently-listed.png";
import RevenueGrowthImage from "../static/revenue-growth.png";
import RndImage from "../static/rnd.png";
import RocketStocksImage from "../static/rocket-stocks.png";
import ShortSqueezeLeadersImage from "../static/short-squeeze-leaders.png";
import ShortSqueezeReversalsImage from "../static/short-squeeze-reversals.png";

export default {
  categories: ["Growth/Quality", "Custom", "Value"],
  data: {
    "Growth/Quality": [
      {
        name: "Four Stars",
        img: FourStarsImage,
        imgName: "four-stars.daf730cd.png",
        slug: "four-stars"
      },
      {
        name: "Rocket Stocks",
        img: RocketStocksImage,
        imgName: "rocket-stocks.8733965e.png",
        slug: "rocket-stocks"
      },
      {
        name: "Cash Kings",
        img: CashKingsImage,
        imgName: "cash-kings.5e2015dd.png",
        slug: "cash-kings"
      },
      {
        name: "Revenue Growth",
        img: RevenueGrowthImage,
        imgName: "revenue-growth.7254a78b.png",
        slug: "revenue-growth"
      }
    ],
    Custom: [
      {
        name: "Short Squeeze Leaders",
        img: ShortSqueezeLeadersImage,
        imgName: "short-squeeze-leaders.d0657c47.png",
        slug: "short-squeeze-leaders"
      },
      {
        name: "Short Squeeze Reversals",
        img: ShortSqueezeReversalsImage,
        imgName: "short-squeeze-reversals.7324bb54.png",
        slug: "short-squeeze-reversals"
      },
      { name: "R&D", img: RndImage, slug: "rnd", imgName: "rnd.fa87c11f.png" },
      {
        name: "Moves and Shakers",
        img: MoversAndShakersImage,
        imgName: "movers-and-shakers.39adc915.png",
        slug: "movers-and-shakers"
      },
      {
        name: "Recently Listed",
        img: RecentlyListedImage,
        imgName: "recently-listed.84cd8a00.png",
        slug: "recently-listed"
      }
    ],
    Value: [
      {
        name: "Earnings Yield",
        img: EarningsYieldImage,
        imgName: "earnings-yield.8473b524.png",
        slug: "earnings-yield"
      },
      {
        name: "Real Buybacks",
        img: RealBuybacksImage,
        imgName: "real-buybacks.3fe7caad.png",
        slug: "real-buybacks"
      },
      {
        name: "Insider Ownership",
        img: InsiderOwnershipImage,
        imgName: "insider-ownership.a925ce45.png",
        slug: "insider-ownership"
      },
      {
        name: "Balance Sheet Strength",
        img: BalanceSheetStrengthImage,
        imgName: "balance-sheet-strength.a8bd8285.png",
        slug: "balance-sheet-strength"
      }
    ]
  }
};
