var data = { free: { price : {}, options : {} }, pro: { price : {}, options : {} }, enterprise: { price : {}, options : {} } };

var pricing = new Vue({
  el: '#pricing',
  data: { data },
  mounted () {
    data.free = { price : {}, options : {} }
    data.pro = { price : {}, options : {} }
    data.enterprise = { price : {}, options : {} }
    setUpDB();
  },
  methods:{
  }
})

async function setUpDB()
{
    await getTierPrice('FREE');
    await getTierPrice('PRO');
    await getTierPrice('ENTERPRISE');
    await getTierOptions('FREE');
    await getTierOptions('PRO');
    await getTierOptions('ENTERPRISE');
}

async function getTierPrice(tier, callback) {
    console.log(tier);
    axios
      .get('/price/' + tier)
      .then(resp => 
            {        
                switch(tier)
                {
                    case 'FREE':
                        data.free.price = resp.data[0];
                        break;
                    case 'PRO':
                        data.pro.price = resp.data[0];
                        break;
                    case 'ENTERPRISE':
                        data.enterprise.price = resp.data[0];
                        break;
                    default:
                        console.log('undefined tier ' + tier);
                }
                return callback;
            }
        )
     .catch(error => {
            console.log(error)
        })
     .finally(() => { 
            console.log(data);
        })
}

async function getTierOptions(tier, callback) {
    console.log(tier);
    axios
      .get('/options/' + tier)
      .then(resp => 
            {        
                switch(tier)
                {
                    case 'FREE':
                        data.free.options = resp.data[0];
                        break;
                    case 'PRO':
                        data.pro.options = resp.data[0];
                        break;
                    case 'ENTERPRISE':
                        data.enterprise.options = resp.data[0];
                        break;
                    default:
                        console.log('undefined tier ' + tier);
                }
                return callback;
            }
        )
     .catch(error => {
            console.log(error)
        })
     .finally(() => { 
            console.log(data);
        })
}
