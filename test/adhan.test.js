import adhan from '../src/Adhan';
import moment from 'moment-timezone';
import { dateByAddingSeconds } from '../src/DateUtils';

test("Verifying the night portion defined by the high latitude rule", () => {
    var p1 = new adhan.CalculationParameters(18, 18);
    p1.highLatitudeRule = adhan.HighLatitudeRule.MiddleOfTheNight;
    expect(p1.nightPortions().fajr).toBe(0.5);
    expect(p1.nightPortions().isha).toBe(0.5);

    var p2 = new adhan.CalculationParameters(18, 18);
    p2.highLatitudeRule = adhan.HighLatitudeRule.SeventhOfTheNight;
    expect(p2.nightPortions().fajr).toBe(1/7);
    expect(p2.nightPortions().isha).toBe(1/7);

    var p3 = new adhan.CalculationParameters(10, 15);
    p3.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    expect(p3.nightPortions().fajr).toBe(10/60);
    expect(p3.nightPortions().isha).toBe(15/60);
});

test("Verifying the angles defined by the calculation method", () => {
    var p1 = adhan.CalculationMethod.MuslimWorldLeague();
    expect(p1.fajrAngle).toBe(18);
    expect(p1.ishaAngle).toBe(17);
    expect(p1.ishaInterval).toBe(0);
    expect(p1.method).toBe("MuslimWorldLeague");

    var p2 = adhan.CalculationMethod.Egyptian();
    expect(p2.fajrAngle).toBe(19.5);
    expect(p2.ishaAngle).toBe(17.5);
    expect(p2.ishaInterval).toBe(0);
    expect(p2.method).toBe("Egyptian");

    var p3 = adhan.CalculationMethod.Karachi();
    expect(p3.fajrAngle).toBe(18);
    expect(p3.ishaAngle).toBe(18);
    expect(p3.ishaInterval).toBe(0);
    expect(p3.method).toBe("Karachi");

    var p4 = adhan.CalculationMethod.UmmAlQura();
    expect(p4.fajrAngle).toBe(18.5);
    expect(p4.ishaAngle).toBe(0);
    expect(p4.ishaInterval).toBe(90);
    expect(p4.method).toBe("UmmAlQura");

    var p5 = adhan.CalculationMethod.Dubai();
    expect(p5.fajrAngle).toBe(18.2);
    expect(p5.ishaAngle).toBe(18.2);
    expect(p5.ishaInterval).toBe(0);
    expect(p5.method).toBe("Dubai");

    var p6 = adhan.CalculationMethod.MoonsightingCommittee();
    expect(p6.fajrAngle).toBe(18);
    expect(p6.ishaAngle).toBe(18);
    expect(p6.ishaInterval).toBe(0);
    expect(p6.method).toBe("MoonsightingCommittee");

    var p7 = adhan.CalculationMethod.NorthAmerica();
    expect(p7.fajrAngle).toBe(15);
    expect(p7.ishaAngle).toBe(15);
    expect(p7.ishaInterval).toBe(0);
    expect(p7.method).toBe("NorthAmerica");

    var p8 = adhan.CalculationMethod.Other();
    expect(p8.fajrAngle).toBe(0);
    expect(p8.ishaAngle).toBe(0);
    expect(p8.ishaInterval).toBe(0);
    expect(p8.method).toBe("Other");

    var p9 = adhan.CalculationMethod.Kuwait();
    expect(p9.fajrAngle).toBe(18);
    expect(p9.ishaAngle).toBe(17.5);
    expect(p9.ishaInterval).toBe(0);
    expect(p9.method).toBe("Kuwait");

    var p10 = adhan.CalculationMethod.Qatar();
    expect(p10.fajrAngle).toBe(18);
    expect(p10.ishaAngle).toBe(0);
    expect(p10.ishaInterval).toBe(90);
    expect(p10.method).toBe("Qatar");
});

test("calculating prayer times", () => {
    var date = new Date(2015, 6, 12);
    var params = adhan.CalculationMethod.NorthAmerica();
    params.madhab = adhan.Madhab.Hanafi;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);

    expect(moment(p.fajr).tz('America/New_York').format("h:mm A")).toBe("4:42 AM");
    expect(moment(p.sunrise).tz("America/New_York").format("h:mm A")).toBe("6:08 AM");
    expect(moment(p.dhuhr).tz("America/New_York").format("h:mm A")).toBe("1:21 PM");
    expect(moment(p.asr).tz("America/New_York").format("h:mm A")).toBe("6:22 PM");
    expect(moment(p.maghrib).tz("America/New_York").format("h:mm A")).toBe("8:32 PM");
    expect(moment(p.isha).tz("America/New_York").format("h:mm A")).toBe("9:57 PM");
    expect(moment(p.isha).tz("America/New_York").format("HH:mm")).toBe("21:57");
});

test("useing offsets to manually adjust prayer times", () => {
    var date = new Date(2015, 11, 1);
    var params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Shafi;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);
    expect(moment(p.fajr).tz("America/New_York").format("h:mm A")).toBe("5:35 AM");
    expect(moment(p.sunrise).tz("America/New_York").format("h:mm A")).toBe("7:06 AM");
    expect(moment(p.dhuhr).tz("America/New_York").format("h:mm A")).toBe("12:05 PM");
    expect(moment(p.asr).tz("America/New_York").format("h:mm A")).toBe("2:42 PM");
    expect(moment(p.maghrib).tz("America/New_York").format("h:mm A")).toBe("5:01 PM");
    expect(moment(p.isha).tz("America/New_York").format("h:mm A")).toBe("6:26 PM");

    params.adjustments.fajr = 10;
    params.adjustments.sunrise = 10;
    params.adjustments.dhuhr = 10;
    params.adjustments.asr = 10;
    params.adjustments.maghrib = 10;
    params.adjustments.isha = 10;

    var p2 = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, params);
    expect(moment(p2.fajr).tz("America/New_York").format("h:mm A")).toBe("5:45 AM");
    expect(moment(p2.sunrise).tz("America/New_York").format("h:mm A")).toBe("7:16 AM");
    expect(moment(p2.dhuhr).tz("America/New_York").format("h:mm A")).toBe("12:15 PM");
    expect(moment(p2.asr).tz("America/New_York").format("h:mm A")).toBe("2:52 PM");
    expect(moment(p2.maghrib).tz("America/New_York").format("h:mm A")).toBe("5:11 PM");
    expect(moment(p2.isha).tz("America/New_York").format("h:mm A")).toBe("6:36 PM");
});

test("calculating prayer times using the Moonsighting Committee calculation method", () => {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 31);
    var p = new adhan.PrayerTimes(new adhan.Coordinates(35.7750, -78.6336), date, adhan.CalculationMethod.MoonsightingCommittee());
    expect(moment(p.fajr).tz("America/New_York").format("h:mm A")).toBe("5:48 AM");
    expect(moment(p.sunrise).tz("America/New_York").format("h:mm A")).toBe("7:16 AM");
    expect(moment(p.dhuhr).tz("America/New_York").format("h:mm A")).toBe("12:33 PM");
    expect(moment(p.asr).tz("America/New_York").format("h:mm A")).toBe("3:20 PM");
    expect(moment(p.maghrib).tz("America/New_York").format("h:mm A")).toBe("5:43 PM");
    expect(moment(p.isha).tz("America/New_York").format("h:mm A")).toBe("7:05 PM");
});

test("calculating Moonsighting Committee prayer times at a high latitude location", () => {
    // Values from http://www.moonsighting.com/pray.php
    var date = new Date(2016, 0, 1);
    var params = adhan.CalculationMethod.MoonsightingCommittee();
    params.madhab = adhan.Madhab.Hanafi;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(59.9094, 10.7349), date, params);
    expect(moment(p.fajr).tz("Europe/Oslo").format("h:mm A")).toBe("7:34 AM");
    expect(moment(p.sunrise).tz("Europe/Oslo").format("h:mm A")).toBe("9:19 AM");
    expect(moment(p.dhuhr).tz("Europe/Oslo").format("h:mm A")).toBe("12:25 PM");
    expect(moment(p.asr).tz("Europe/Oslo").format("h:mm A")).toBe("1:36 PM");
    expect(moment(p.maghrib).tz("Europe/Oslo").format("h:mm A")).toBe("3:25 PM");
    expect(moment(p.isha).tz("Europe/Oslo").format("h:mm A")).toBe("5:02 PM");
});    

test("getting the time for a given prayer", () => {
    var date = new Date(2016, 6, 1);
    var params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(59.9094, 10.7349), date, params);
    expect(p.timeForPrayer(adhan.Prayer.Fajr)).toBe(p.fajr);
    expect(p.timeForPrayer(adhan.Prayer.Sunrise)).toBe(p.sunrise);
    expect(p.timeForPrayer(adhan.Prayer.Dhuhr)).toBe(p.dhuhr);
    expect(p.timeForPrayer(adhan.Prayer.Asr)).toBe(p.asr);
    expect(p.timeForPrayer(adhan.Prayer.Maghrib)).toBe(p.maghrib);
    expect(p.timeForPrayer(adhan.Prayer.Isha)).toBe(p.isha);
    expect(p.timeForPrayer(adhan.Prayer.None)).toBe(null);
});

test("getting the current prayer", () => {
    var date = new Date(2015, 8, 1);
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(33.720817, 73.090032), date, params);
    expect(p.currentPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(adhan.Prayer.None);
    expect(p.currentPrayer(p.fajr)).toBe(adhan.Prayer.Fajr);
    expect(p.currentPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(adhan.Prayer.Fajr);
    expect(p.currentPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(adhan.Prayer.Sunrise);
    expect(p.currentPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(adhan.Prayer.Dhuhr);
    expect(p.currentPrayer(dateByAddingSeconds(p.asr, 1))).toBe(adhan.Prayer.Asr);
    expect(p.currentPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(adhan.Prayer.Maghrib);
    expect(p.currentPrayer(dateByAddingSeconds(p.isha, 1))).toBe(adhan.Prayer.Isha);
});

test("getting the next prayer", () => {
    var date = new Date(2015, 8, 1);
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(33.720817, 73.090032), date, params);
    expect(p.nextPrayer(dateByAddingSeconds(p.fajr, -1))).toBe(adhan.Prayer.Fajr);
    expect(p.nextPrayer(p.fajr)).toBe(adhan.Prayer.Sunrise);
    expect(p.nextPrayer(dateByAddingSeconds(p.fajr, 1))).toBe(adhan.Prayer.Sunrise);
    expect(p.nextPrayer(dateByAddingSeconds(p.sunrise, 1))).toBe(adhan.Prayer.Dhuhr);
    expect(p.nextPrayer(dateByAddingSeconds(p.dhuhr, 1))).toBe(adhan.Prayer.Asr);
    expect(p.nextPrayer(dateByAddingSeconds(p.asr, 1))).toBe(adhan.Prayer.Maghrib);
    expect(p.nextPrayer(dateByAddingSeconds(p.maghrib, 1))).toBe(adhan.Prayer.Isha);
    expect(p.nextPrayer(dateByAddingSeconds(p.isha, 1))).toBe(adhan.Prayer.None);
});

test("getting the current next prayer", () => {
    var date = new Date();
    var params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Hanafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
    var p = new adhan.PrayerTimes(new adhan.Coordinates(33.720817, 73.090032), date, params);
    const current = p.currentPrayer();
    const next = p.nextPrayer();
    expect(current != null || next != null).toBeTruthy();
});
