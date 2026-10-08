import test from 'node:test';
import assert from 'node:assert/strict';
import {monthOptions,formatMonthPeriod,experienceDates,experiencePeriod} from '../src/lib/experiencePeriod.js';
test('Uzbek names do not depend on incomplete Intl month data',()=>{assert.equal(formatMonthPeriod('2024-07 - 2025-01','UZ'),'2024-yil iyul - 2025-yil yanvar');assert.equal(monthOptions('UZ')[11].label,'dekabr');assert.equal(monthOptions('UZ')[2].label,'mart');});
test('other languages and legacy year-only dates remain intact',()=>{for(const language of ['RU','ENG','JP']){assert.equal(formatMonthPeriod('2024 - 2026',language),'2024 - 2026');assert.notEqual(formatMonthPeriod('2024-07',language),'2024-07');}const form=experienceDates('2024-12 - 2026-03');assert.equal(experiencePeriod(form),'2024-12 - 2026-03');assert.equal(experienceDates('2024 - 2026').startMonth,'');});
