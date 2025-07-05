// Cloudflare Worker for deployment status badge
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const projectName = url.searchParams.get('projectName') || 'mofei-life-web';
    
    try {
      // Fetch deployment status from Cloudflare API
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${projectName}/deployments`,
        {
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const latestDeployment = data.result[0];
      
      if (!latestDeployment) {
        throw new Error('No deployments found');
      }

      const status = latestDeployment.latest_stage.status;
      const deployTime = new Date(latestDeployment.created_on).toLocaleString();
      
      // Generate badge response for shields.io
      const badgeData = {
        schemaVersion: 1,
        label: 'Deployment',
        message: `${status} (${deployTime})`,
        color: status === 'success' ? 'brightgreen' : 
               status === 'failure' ? 'red' : 
               status === 'active' ? 'blue' : 'yellow',
        style: 'flat-square'
      };

      return new Response(JSON.stringify(badgeData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      // Error badge
      const errorBadge = {
        schemaVersion: 1,
        label: 'Deployment',
        message: 'unknown',
        color: 'lightgrey',
        style: 'flat-square'
      };

      return new Response(JSON.stringify(errorBadge), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};