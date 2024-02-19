async function logFootballGroundNames() {
    try {
      const response = await fetch("https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp5.json");
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const facilities = await response.json();
  
      for (const facility of facilities) {
        console.log(facility.Name_en);
      }
    } catch (error) {
      console.error('Could not fetch the football grounds:', error);
    }
  }
  
  logFootballGroundNames();