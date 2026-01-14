import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Logging utility with timestamps
const log = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '[ERROR]' : level === 'warn' ? '[WARN]' : '[INFO]';
  // Use process.stdout.write for cleaner seed script output
  process.stdout.write(`${timestamp} ${prefix} ${message}\n`);
};

// Database connection check with retry logic
async function checkDatabaseConnection(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log(`Attempting to connect to database (attempt ${attempt}/${retries})...`);
      await prisma.$connect();
      log('Database connection established successfully.');
      return;
    } catch (error) {
      let errorType = 'unknown';
      let errorMessage = 'Unknown error';

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          errorType = 'network';
          errorMessage = `Network connection error: ${error.message}`;
        } else if (error.code === 'P1010') {
          errorType = 'access';
          errorMessage = `Access denied: ${error.message}`;
        } else {
          errorMessage = `Prisma error (${error.code}): ${error.message}`;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
          errorType = 'tls';
          errorMessage = `TLS/SSL error: ${error.message}`;
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
          errorType = 'network';
          errorMessage = `Network error: ${error.message}`;
        } else {
          errorMessage = `Unexpected error: ${error.message}`;
        }
      } else {
        errorMessage = `Unexpected non-Error thrown: ${String(error)}`;
      }

      log(errorMessage, 'error');

      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000; // exponential backoff
        log(`Retrying connection in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Failed to establish database connection after ${retries} attempts. Last error: ${errorMessage}`);
      }
    }
  }
}

// Parse command-line arguments and environment variables for clear flag
const shouldClear = process.argv.includes('--clear') || process.env.CLEAR_EXISTING === 'true';

const gameEvents = [
  {
    id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "Office Luck or Troll?",
    description: "20 Boxes. Only 3 Big Prizes. The rest are nightmares!",
    created_at: "2026-01-02 19:46:59.966349+00",
  },
  {
    id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "စားသောက်ဖွယ်ရာ ကံစမ်းမဲ",
    description: "ဗိုက်ပြည့်စေမည့် ဆုမဲများ",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "မဟာသင်္ကြန် ငွေသားဆုမဲကြီး",
    description: "အမြင့်ဆုံး သိန်း ၅၀ ကံစမ်းနိုင်မည့် အခွင့်အရေး",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "အိမ်သုံးပစ္စည်း ကံစမ်းမဲ",
    description: "အိမ်ရှင်မ/အိမ်ရှင်ထီးများအတွက်",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "89d857df-818b-48d6-927b-a783a97456a1",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "ရယ်မောခြင်း သို့မဟုတ် ငိုကြွေးခြင်း",
    description: "Troll သက်သက် ဖန်တီးထားသည်",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "Chill ပြီး နားဖို့ ဆုမဲများ",
    description: "ရုပ်ရှင်၊ သီချင်း၊ ဂိမ်း",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "Truth or Dare Challenge",
    description: "သူငယ်ချင်းများစုပြီးဆော့ရန်",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    creator_id: "7f7c36d8-bbd5-4a61-9428-62477967011f",
    event_name: "Gadget Crazy",
    description: "IT ပစ္စည်းများ သီးသန့်",
    created_at: "2026-01-02 20:37:22.10167+00",
  },
  {
    id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    creator_id: "f866896d-87e2-4705-bd66-dc7b834cebb8",
    event_name: "Girlfriend",
    description: "သင့်လက်တွဲဖော် အမျိုးသမီးရွေးချယ်ပါ",
    created_at: "2026-01-03 17:26:55.385126+00",
  },
  {
    id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    creator_id: "4d5e5ecb-bc7d-4e80-a191-bf713f77318b",
    event_name: "KBZ Company Thadingyut Lucky Draw",
    description:
      "ဝန်ထမ်းများအတွက် နှစ်စဉ် ကံစမ်းမဲ (ရွှေ၊ ငွေ၊ အိမ်သုံးပစ္စည်း)",
    created_at: "2026-01-03 17:33:32.244795+00",
  },
  {
    id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    creator_id: "4d5e5ecb-bc7d-4e80-a191-bf713f77318b",
    event_name: "Weekend Foodie Challenge 🌶️",
    description: "သူငယ်ချင်းများစုစားကြမယ်.. ဘယ်သူရှင်းမလဲ၊ ဘာစားမလဲ?",
    created_at: "2026-01-03 17:33:32.244795+00",
  },
  {
    id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    creator_id: "4d5e5ecb-bc7d-4e80-a191-bf713f77318b",
    event_name: "Win Mobile World - New Year Promo",
    description: "ဖုန်းဝယ်သူများအတွက် ကံစမ်းမဲ အစီအစဉ်",
    created_at: "2026-01-03 17:33:32.244795+00",
  },
  {
    id: "1ab2ef7b-7720-4107-ac7a-fb92599f8cef",
    creator_id: "80f7a52d-5ecb-4c1b-b0d4-7fd751b79939",
    event_name: "Ooa",
    description: "Choose 1",
    created_at: "2026-01-04 02:49:54.312677+00",
  },
  {
    id: "8eaf680b-c192-4ffa-acca-7a39882b7025",
    creator_id: "62a33305-203f-4e29-89ca-4cd4e63b1601",
    event_name: "Ulric Rosa",
    description: "Qui voluptatem sequ",
    created_at: "2026-01-04 14:16:09.813668+00",
  },
  {
    id: "8b37098c-a79a-4282-b337-b300e4a81726",
    creator_id: "f7c12ca2-6b0b-4571-bbbf-536ee0c79bdb",
    event_name: "Yyy",
    description: "Yyy",
    created_at: "2026-01-04 17:23:57.101059+00",
  },
  {
    id: "94f098c8-8881-4b28-8621-24dc2205c033",
    creator_id: "0b1f0b57-73c7-4d17-b751-1a87917a0d0a",
    event_name: "10 years later...",
    description: "",
    created_at: "2026-01-04 17:49:07.562417+00",
  },
  {
    id: "706742ec-9e1a-424a-8661-348c47fb30dc",
    creator_id: "0b1f0b57-73c7-4d17-b751-1a87917a0d0a",
    event_name: "may be or not",
    description: "should i tell my crush ''i like u''",
    created_at: "2026-01-04 18:02:31.028676+00",
  },
  {
    id: "3ecfb880-08ee-4724-8468-7c831718f1a1",
    creator_id: "7fdbd9fd-a479-4747-927e-97321e938273",
    event_name: "test",
    description: "test",
    created_at: "2026-01-05 03:56:40.419684+00",
  },
  {
    id: "378b718c-46f1-4fe2-a901-0e474bd35954",
    creator_id: "2527f054-d8c1-4847-a187-6832da9cdd62",
    event_name: "Total Day",
    description:
      "╔━━✦✦❤️✦✦━━\n🥰💓 𝐅𝐨𝐥𝐥𝐨𝐰  𝐌𝐞  💓🥰\n💓💥𝐁𝐚𝐜𝐤 𝐭𝐨 𝐁𝐚𝐜𝐤 💥💞\n 💝just write done💝\n╚━━✦✦❤️✦✦━━╝",
    created_at: "2026-01-05 11:16:40.838489+00",
  },
  {
    id: "08181269-8e3b-4bcd-9200-89e51ffce29f",
    creator_id: "626b6bc4-816f-423d-9bc0-8fdcd8698258",
    event_name: "ခရီးသွားကြမယ် 🧳",
    description:
      "မငြင်းကြေး ၊ မလိုက်ဘူး‌လို့ပြောလို့မရ ၊ အရှင်းအရှင်းတွေ ဖြတ်ခဲ့ ၊ အပျော်ရွှင်ဆုံး ဖန်တီးကြမယ် ။",
    created_at: "2026-01-05 12:31:19.923873+00",
  },
];

const prizePool = [
  {
    id: "57cb8580-c5b8-4f92-ac5c-528268cda485",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "iPhone 15 Pro Max",
    value: "1500",
    is_blank: false,
    sort_order: 0,
  },
  {
    id: "d8fccb34-29b1-4d1c-a7c9-d3b3c3a44818",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Gold Ring (1 Gram)",
    value: "100",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "acf33cb8-7821-4308-9421-eb40c780170b",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Cash $50",
    value: "50",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "ec6efa80-c6c8-45d9-b665-d3fad24a3cf2",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Mobile Bill $5",
    value: "5",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "708e1012-cb76-45e8-9f9c-eed6dcdfe734",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Coffee Mix (1 Pack)",
    value: "2",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "d0b8b89d-fbfb-45f2-9ab0-4353ff557f2e",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Mama Noodle (Chicken)",
    value: "1",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "12053d2e-4105-4b71-a66b-4ea4abaf01f3",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Pen (Blue)",
    value: "0.5",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "0eb0bec9-4580-4b16-9512-fe581d98a7b0",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Left Slipper Only (ဖိနပ်ဘယ်တစ်ဖက်)",
    value: "0",
    is_blank: false,
    sort_order: 7,
  },
  {
    id: "7082ea88-9034-4b2f-9d97-7ccbc53ae00c",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Used Tissue (တစ်ရှူးသုံးပြီးသား)",
    value: "0",
    is_blank: false,
    sort_order: 8,
  },
  {
    id: "c863b93e-543c-424c-b844-86bdc8458800",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "A Stone (လမ်းဘေးက ကျောက်ခဲ)",
    value: "0",
    is_blank: false,
    sort_order: 9,
  },
  {
    id: "b1821d54-072d-4ef7-877c-89e6a50bbd55",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Plastic Bag (ကြွပ်ကြွပ်အိတ်)",
    value: "0",
    is_blank: false,
    sort_order: 10,
  },
  {
    id: "671468d1-aa04-4342-b6f2-16537e5dcac3",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Sing a Song (သီချင်းဆိုပြရမည်)",
    value: "0",
    is_blank: false,
    sort_order: 11,
  },
  {
    id: "110931c5-4872-4189-97cb-dc39f8536bcc",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "10 Push-ups (ဒိုက် ၁၀ ခါထိုး)",
    value: "0",
    is_blank: false,
    sort_order: 12,
  },
  {
    id: "82b7f2de-758b-4655-8c8f-427695da3a0e",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Drink Water (ရေတစ်ခွက်သောက်)",
    value: "0",
    is_blank: false,
    sort_order: 13,
  },
  {
    id: "1ae18278-760d-4eb8-a5d7-6e8d6c5518b3",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Slap on Face (ပါးရိုက်ခံရမည်)",
    value: "0",
    is_blank: false,
    sort_order: 14,
  },
  {
    id: "811a5e51-9ee0-41c5-aaef-d295faa0798a",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Empty Box (ဗလာ)",
    value: "0",
    is_blank: false,
    sort_order: 15,
  },
  {
    id: "76a3d465-da44-41f7-9d42-bc229f7997d8",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Try Again",
    value: "0",
    is_blank: false,
    sort_order: 16,
  },
  {
    id: "bc345210-9cc4-4640-a5cc-12988f62ccea",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Nothing Here",
    value: "0",
    is_blank: false,
    sort_order: 17,
  },
  {
    id: "e32d4004-92c1-4364-9a09-26f463472dad",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Air (လေ)",
    value: "0",
    is_blank: false,
    sort_order: 18,
  },
  {
    id: "441d4aa7-f277-40b2-a99a-8ea46851bf50",
    event_id: "2b4ae830-a20a-4f61-b991-3d510c2032a3",
    name: "Better Luck Next Time",
    value: "0",
    is_blank: false,
    sort_order: 19,
  },
  {
    id: "3fa34062-5411-4873-ba01-c18eb85df2c4",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "ပရီမီယံ ဒူးရင်းသီး (တစ်လုံး)",
    value: "120000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "81da8c64-568c-40a6-bc1c-1ed5dab2f340",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "Pizza Company (Family Set)",
    value: "65000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "dafede7c-e2ec-44a5-914f-cc834c3b6d91",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "KFC ကြက်ကြော် (၅) တုံး",
    value: "35000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "03ce8fa2-bb51-4050-b855-fd85723975e1",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "ပန်းသီး (၃) လုံး",
    value: "5000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "99b9d22e-3397-48a9-8e8a-b6af85fd73f7",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "ငရုတ်သီးစိမ်း (၁၀) တောင့်",
    value: "500",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "d28f9ce3-2fab-4901-b223-0f9425be8c2c",
    event_id: "f1eb9738-4084-43d7-ab6f-94a44d7b0fa9",
    name: "ကြက်ဥ အစိမ်း (၁) လုံး",
    value: "300",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "6cc63d0e-a950-4d2a-afee-7bb0830f444a",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ကျပ် သိန်း (၅၀)",
    value: "5000000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "fda24afd-b94f-48fa-810d-0d728243ff5a",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ကျပ် (၁၀) သိန်း",
    value: "1000000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "b63acdf3-cd21-46c4-8bbb-011f7487fca6",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ကျပ် (၁) သိန်း",
    value: "100000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "546b8b70-9753-4226-91a3-debe0074550b",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ကျပ် ၅ သောင်း",
    value: "50000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "8212e5c6-be0c-4cd9-bac3-6f1df339115c",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ၁ ထောင်ကျပ်",
    value: "1000",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "4b0a358a-de57-4108-86d9-ed8c982f537f",
    event_id: "cf3cfc27-981b-4407-a9d6-fea3562e36c7",
    name: "ငွေသား ၅၀ ကျပ် (အစုတ်)",
    value: "50",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "e3930bc8-6337-432f-a9ce-455d913d92b9",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "Bosh လွန်ပူစက် (Drill)",
    value: "150000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "8607d33b-827b-4acb-8428-4c1fc0f2d452",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "မီးပူ (Iron)",
    value: "45000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "f70b5c91-71b7-42bc-9b2c-f56ec9dc107e",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "တူ (Hammer)",
    value: "8000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "5420b975-dfe6-4533-b994-a953c60ef4c2",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "ကတ်ကြေး",
    value: "3000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "d944c054-d072-4f98-9518-cc67ba2bf242",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "သံ (၃) ချောင်း",
    value: "200",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "aa89f126-7654-4f6e-ba8d-9321e5bca865",
    event_id: "d4b55cf9-9432-4829-9e83-26fe9de6eff5",
    name: "ပလပ်စတစ် ကြိုးခွေ",
    value: "100",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "c5ca1b24-9612-4faa-887c-7348b3955819",
    event_id: "89d857df-818b-48d6-927b-a783a97456a1",
    name: "ဘိနပ် ဘယ်ဖက် တစ်ဖက်",
    value: "0",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "b50e070e-b69f-4ebf-8b86-c7f7f521be29",
    event_id: "89d857df-818b-48d6-927b-a783a97456a1",
    name: "ရေသန့်ဘူးခွံ (အလွတ်)",
    value: "0",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "3027218b-5c9c-4551-af4e-a57d0caca4fe",
    event_id: "89d857df-818b-48d6-927b-a783a97456a1",
    name: "ကြွပ်ကြွပ်အိတ် အနက်",
    value: "0",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "6dab303a-c02c-4c31-b0ef-3c440c78761d",
    event_id: "89d857df-818b-48d6-927b-a783a97456a1",
    name: "ခွေးချေး ပုံစံ အရုပ်",
    value: "0",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "caa4aafe-f990-485a-8667-90364fb796a0",
    event_id: "89d857df-818b-48d6-927b-a783a97456a1",
    name: "လေ (Air)",
    value: "0",
    is_blank: true,
    sort_order: 5,
  },
  {
    id: "2294bab9-efb6-4859-adec-40bd607908c3",
    event_id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    name: "Junction City ရုပ်ရှင်လက်မှတ် (၂) စောင်",
    value: "35000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "845040ae-a934-4166-832f-bc8ccd983778",
    event_id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    name: "Netflix (၁) လ စာ",
    value: "15000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "8a2bb806-8b86-484b-ab5b-959e4bf7747d",
    event_id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    name: "Mobile Legends Diamonds (100)",
    value: "5000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "8bb25e6d-5e08-4f18-be61-b4de89030d14",
    event_id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    name: "Spotify Premium (1 Month)",
    value: "8000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "c94cbb16-ef7a-4980-ad48-83754063ed13",
    event_id: "6097ab34-5f54-4fa4-9577-e0eb8015b42e",
    name: "Youtube Video Link (Rick Roll)",
    value: "0",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "e9628df1-6a7f-418b-bfd9-dae1d96ca8fa",
    event_id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    name: "အမှန်ပြော - Crush က ဘယ်သူလဲ?",
    value: "0",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "d1eac0a3-442d-40bd-bc43-07bcd005ec49",
    event_id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    name: "အမှန်ပြော - နောက်ဆုံးကြည့်ခဲ့တဲ့ Video?",
    value: "0",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "e41530b6-6177-4b88-b44c-ddfb210108e6",
    event_id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    name: "လုပ်ရပ် - ကြက်ဖ တွန်သံ လုပ်ပြပါ",
    value: "0",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "271103c0-2112-4179-b663-b394d4234500",
    event_id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    name: "လုပ်ရပ် - လက်ရှိဖွင့်ထားတဲ့သီချင်း ကပြပါ",
    value: "0",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "09d5df64-9aab-44d0-9722-ee764a55f49c",
    event_id: "3f4e0432-a398-42f9-aaf7-e841b042cba6",
    name: "လုပ်ရပ် - ဘေးလူကို ပါးလေးလေးရိုက်ပါ",
    value: "0",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "b4ad670e-ede1-4a7d-94db-1027b364fe0f",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "iPhone 15 Pro",
    value: "4500000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "3b3f1bb3-f390-4611-825b-974d049831a2",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "Sony WH-1000XM5 Headphone",
    value: "1200000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "4877bbe3-e980-47ce-9661-e964a4b2e4fc",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "Remax Power Bank 20000mAh",
    value: "65000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "0b82fa09-9455-4a8f-b11c-174b6abb7798",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "USB Stick 32GB",
    value: "15000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "ff7ad939-365d-4d4a-ae1e-f1f76cf06131",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "Mouse Pad အစုတ်",
    value: "0",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "c560f9b9-9fee-4063-9182-63d5a06b47c9",
    event_id: "cc1e2335-4c86-474d-9d2f-860538f47323",
    name: "USB Type-C ကြိုးပြတ်",
    value: "0",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "6cbefb22-13e8-4292-9aa5-3407201ff6a0",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "သင်ဇာဝင့်ကျော်",
    value: "18000",
    is_blank: false,
    sort_order: 0,
  },
  {
    id: "eeb7a788-bc5d-4e77-b4e8-c2954412b03f",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ခင်ဝင့်ဝါ",
    value: "15000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "b530e5f2-b2a1-4644-b038-44dec4385e48",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ပိုးမမှီသာ",
    value: "8000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "adfc5f02-497e-463f-96b4-0d683d32b41f",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ဝတ်မှုန်ရွှေရည်",
    value: "5000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "6490d988-9eda-4fdb-9e7a-e2d03801955c",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ခင်စန်းဝင်း",
    value: "310",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "5d0fb042-45e7-4a5a-8ec3-3fe7f871f7d2",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "မိတ်ကပ် လင်းလင်း",
    value: "300",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "d9c8526b-96d5-4c8b-8eaf-bb80be713450",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ဖြူဖြူထွေး",
    value: "100",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "ac586436-cf4f-4a45-a299-be3020d5ae11",
    event_id: "440f5d31-46c1-45fe-ab2e-e394a553dfe9",
    name: "ဇေရဲထကမ",
    value: "0",
    is_blank: false,
    sort_order: 7,
  },
  {
    id: "382d7b93-b2b2-4536-b409-3a2c913ff0e0",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "အခေါက်ရွှေ (၁) ကျပ်သား",
    value: "6500000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "b297e7ad-01bc-49e1-b3e5-8eee3b9aa6bd",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "iPhone 15 Pro Max (Titanium)",
    value: "4800000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "6a8dca39-6bd2-4c08-a0bd-601b846d4522",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Bonus လစာ (၃) လစာ",
    value: "1500000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "fa6c8842-5441-4c1c-8868-f7668e88bce1",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Samsung 2 Door ရေခဲသေတ္တာ",
    value: "800000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "c29bf7ca-5f92-4fb3-aae2-8ef47a1c3ecb",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Smart TV 43 Inch",
    value: "600000",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "387bb46c-a906-4952-b9cf-17ecef1169ca",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Air Fryer (Philips)",
    value: "250000",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "fbcb7e32-18e0-4166-a0f2-3c563f658862",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "ရွှေဘိုပေါ်ဆန်းမွှေး ဆန် (၁) အိတ်",
    value: "120000",
    is_blank: false,
    sort_order: 7,
  },
  {
    id: "946f9629-f7ca-4a24-838d-f071d1fb7f4a",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "မီးဖိုချောင်သုံး ဆီ (၁၀) ပိဿာ",
    value: "100000",
    is_blank: false,
    sort_order: 8,
  },
  {
    id: "61650954-452c-4348-b0fb-c2dfe6e1ea6e",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "City Mart Voucher (50,000)",
    value: "50000",
    is_blank: false,
    sort_order: 9,
  },
  {
    id: "70c9aa7c-3da0-4c46-adad-f30c09954f3e",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "KBZPay Angpao (30,000)",
    value: "30000",
    is_blank: false,
    sort_order: 10,
  },
  {
    id: "4c8a5789-c0c6-4d24-b03f-6513caf00a04",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Yum Yum ခေါက်ဆွဲ (၁) ဖာ",
    value: "15000",
    is_blank: false,
    sort_order: 11,
  },
  {
    id: "d7a9c670-58c3-40cd-aa29-6d1527607833",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Royal-D အချိုရည် (၁) ကပ်",
    value: "12000",
    is_blank: false,
    sort_order: 12,
  },
  {
    id: "dfacfb0c-d54d-4efd-ad6a-c13d5d122b54",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Tissue Box (1) set",
    value: "5000",
    is_blank: false,
    sort_order: 13,
  },
  {
    id: "c614f030-a06d-4de7-84bb-e8ea99c9a710",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "Boss ကို ကော်ဖီဖျော်တိုက်ရမည်",
    value: "0",
    is_blank: false,
    sort_order: 14,
  },
  {
    id: "5b7cdae8-3e24-4ef0-b781-65803b4dd7a4",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "ရုံးဆင်းချိန် ၁ နာရီ နောက်ကျရမည်",
    value: "0",
    is_blank: false,
    sort_order: 15,
  },
  {
    id: "0717d097-06e1-4f9a-a063-38126763fa94",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "သီချင်းဆိုပြရမည်",
    value: "0",
    is_blank: false,
    sort_order: 16,
  },
  {
    id: "ec1f9ef6-0a76-42e0-b401-57db8a2a07dc",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "လက်ခုပ်တီးပြီး အားပေးပါ",
    value: "0",
    is_blank: true,
    sort_order: 17,
  },
  {
    id: "44bf3f70-371c-4ca2-8384-f81a1700b81f",
    event_id: "407b81e7-d770-4178-bea6-d4e91148dabd",
    name: "ကျေးဇူးတင်ပါတယ် (Better luck next time)",
    value: "0",
    is_blank: true,
    sort_order: 18,
  },
  {
    id: "6af237c6-8974-4f98-b623-75dd61b3e237",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Beauty in the Pot (တခါစား)",
    value: "150000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "44ead10a-068c-47f8-8435-bc7c8b5dab3a",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Mala Xiang Guo (၅ သောင်းဖိုး)",
    value: "50000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "8adf9e8f-a7f8-44c5-818b-00c8d69cc05f",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "YKKO ကြေးအိုး (Family Set)",
    value: "35000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "fabde33e-7406-4163-b421-7d9390f4ebc8",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Pizza Company (BOGO)",
    value: "30000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "dcc1f818-4d76-45ca-817b-99617c4819f5",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Gong Cha Bubble Tea",
    value: "8000",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "6ad17215-5a0c-4ace-afff-3abd85589bca",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Lotteria ကြက်ကြော်",
    value: "5000",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "5c786bae-f941-4c6c-b77e-5134e0b814ea",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "ဒီနေ့ ဘေလ်အကုန်ရှင်းရမည် (Bill Payer)",
    value: "0",
    is_blank: false,
    sort_order: 7,
  },
  {
    id: "6db03fc4-8aaf-4d73-8225-981e9a71198d",
    event_id: "e9f99d41-2975-41df-b518-ebadd5f6b28b",
    name: "Taxi ခ ရှင်းရမည်",
    value: "0",
    is_blank: false,
    sort_order: 8,
  },
  {
    id: "6106618e-b42d-4557-aa28-357349664f3f",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "iPad Air 5",
    value: "2500000",
    is_blank: false,
    sort_order: 1,
  },
  {
    id: "29503bf1-703f-4524-aac1-8a71d60c837d",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "Redmi Note 13 Pro",
    value: "800000",
    is_blank: false,
    sort_order: 2,
  },
  {
    id: "b367861a-00f4-46d8-aaa3-96306543cc79",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "Sony Headphone",
    value: "400000",
    is_blank: false,
    sort_order: 3,
  },
  {
    id: "e6830e8f-c050-46ac-8db2-f0eaa5067d49",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "Power Bank 20000mAh",
    value: "60000",
    is_blank: false,
    sort_order: 4,
  },
  {
    id: "46dd6385-99e5-4aab-a3b6-b2b5cb4f0bdf",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "MPT Bill 10,000",
    value: "10000",
    is_blank: false,
    sort_order: 5,
  },
  {
    id: "0a0297ea-fedf-4556-8e37-3dde53138759",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "Ooredoo Bill 5,000",
    value: "5000",
    is_blank: false,
    sort_order: 6,
  },
  {
    id: "bd2e8468-24d2-4cb4-8ad8-f32a42d0d63c",
    event_id: "e3e47bb8-1647-4699-ae0c-bc3846c60881",
    name: "Phone Cover",
    value: "3000",
    is_blank: false,
    sort_order: 7,
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Puzzle Enthusiast',
    content: 'Puzzle Place has transformed how I enjoy games. The community is amazing and the prizes are fantastic!',
    avatar: 'https://picsum.photos/100/100?random=20',
  },
  {
    name: 'Mike Chen',
    role: 'Strategy Gamer',
    content: 'I\'ve never seen a platform that brings together so many different game types. Highly recommended!',
    avatar: 'https://picsum.photos/100/100?random=21',
  },
  {
    name: 'Emily Davis',
    role: 'Trivia Lover',
    content: 'The events are well-organized and the interface is so user-friendly. I keep coming back for more!',
    avatar: 'https://picsum.photos/100/100?random=22',
  },
];

// Extract unique creator user IDs from gameEvents
const uniqueCreatorIds = Array.from(new Set(gameEvents.map(event => event.creator_id)));

const users = uniqueCreatorIds.map((id, index) => ({
  id,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  username: `user${index + 1}`,
  PasswordHash: "$2b$10$abcdefghijklmnopqrstuvxyz1234567890ABCDEFGHIJKLMNOPQ",
  emailVerified: true,
}));

const accounts = uniqueCreatorIds.map((id, index) => ({
  userId: id,
  providerId: "credential",
  accountId: `user${index + 1}@example.com`,
  password: "$2b$10$abcdefghijklmnopqrstuvxyz1234567890ABCDEFGHIJKLMNOPQ",
}));

async function main() {
  log(`Starting seed process. Clear existing data: ${shouldClear}`);

  await checkDatabaseConnection();

  try {
    // Seed users
    log(`Seeding ${users.length} users...`);
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    log(`Seeded users successfully.`);

    // Seed accounts
    log(`Seeding ${accounts.length} accounts...`);
    for (const account of accounts) {
      await prisma.account.upsert({
        where: { providerId_accountId: { providerId: account.providerId, accountId: account.accountId } },
        update: account,
        create: account,
      });
    }
    log(`Seeded accounts successfully.`);

    if (shouldClear) {
      log('Clearing existing seed data...');
      // Delete in reverse order to handle dependencies within a transaction
      await prisma.$transaction(async (tx) => {
        await tx.testimonial.deleteMany({
          where: { name: { in: testimonials.map(t => t.name) } }
        });
        await tx.eventPrizePool.deleteMany({
          where: { EventID: { in: gameEvents.map(e => e.id) } }
        });
        await tx.gameEvent.deleteMany({
          where: { EventID: { in: gameEvents.map(ev => ev.id) } }
        });
        await tx.account.deleteMany({
          where: { userId: { in: uniqueCreatorIds } }
        });
        await tx.user.deleteMany({
          where: { id: { in: uniqueCreatorIds } }
        });
      });
      log('Cleared existing data.');
    }

    // Validate data integrity: ensure all event_ids in prizes exist in gameEvents
    const eventIds = new Set(gameEvents.map(e => e.id));
    const invalidPrizes = prizePool.filter(p => !eventIds.has(p.event_id));
    if (invalidPrizes.length > 0) {
      throw new Error(`Data integrity violation: Prizes reference non-existent events: ${invalidPrizes.map(p => p.id).join(', ')}`);
    }

    // Seed game events and their prizes in groups for atomicity
    log(`Seeding ${gameEvents.length} game events and their prizes...`);
    let totalPrizeCount = 0;
    for (let i = 0; i < gameEvents.length; i++) {
      const event = gameEvents[i];
      const eventPrizes = prizePool.filter(p => p.event_id === event.id);

      await prisma.$transaction(async (tx) => {
        // Upsert the event
        await tx.gameEvent.upsert({
          where: { EventID: event.id },
          update: {
            CreatorUserID: event.creator_id,
            EventName: event.event_name,
            Description: event.description,
            CreatedAt: new Date(event.created_at),
          },
          create: {
            EventID: event.id,
            CreatorUserID: event.creator_id,
            EventName: event.event_name,
            Description: event.description,
            CreatedAt: new Date(event.created_at),
          },
        });

        // Seed prizes for this event
        for (const prize of eventPrizes) {
          const existing = await tx.eventPrizePool.findUnique({
            where: { PrizeID: prize.id },
          });
          if (!existing) {
            await tx.eventPrizePool.create({
              data: {
                PrizeID: prize.id,
                EventID: prize.event_id,
                PrizeName: prize.name,
                PrizeValue: parseFloat(prize.value),
                DisplayOrder: prize.sort_order,
                IsBlank: prize.is_blank,
              },
            });
            totalPrizeCount++;
          }
        }
      });

      if ((i + 1) % 5 === 0 || i === gameEvents.length - 1) {
        log(`Seeded ${i + 1}/${gameEvents.length} events and ${totalPrizeCount} prizes so far`);
      }
    }
    log(`Seeded ${gameEvents.length} game events and ${totalPrizeCount} prize pools successfully.`);

    // Seed testimonials individually
    log(`Seeding ${testimonials.length} testimonials...`);
    for (let i = 0; i < testimonials.length; i++) {
      const testimonial = testimonials[i];
      const existing = await prisma.testimonial.findFirst({
        where: {
          name: testimonial.name,
          role: testimonial.role,
        },
      });
      if (!existing) {
        await prisma.testimonial.create({
          data: {
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            avatar: testimonial.avatar,
          },
        });
        log(`Seeded testimonial: ${testimonial.name}`);
      } else {
        log(`Skipped testimonial: ${testimonial.name} (already exists)`);
      }
    }
    log(`Seeded testimonials successfully.`);

    log("Seeding completed successfully.");
  } catch (error) {
    log(`Error during seeding: ${error}`, 'error');
    throw error;
  }
}

main()
  .catch((e) => {
    log(`Seeding failed: ${e}`, 'error');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    log("Database connection closed.");
  });
