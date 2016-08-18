// 'data' is updated by server-end.
var data = {
    step_num: 1,
    round_num: 1,
    user: {
        name: 'Xiaoyu Tai',
        type: 'buyer',
        profit_price: 8,
        profit: {
            round: null,
            total: 2.00
        },
        rank: {
            ranking: 2,
            ranking_total: 10
        }
    },
    market: {
        buyers: [{
            name: "David",
            price: 5.9
        }, {
            name: "Adam",
            price: 4.1
        }, {
            name: "Tony",
            price: 6.2
        }, {
            name: "Martin",
            price: 7.2
        }, {
            name: "Lo",
            price: 7.2
        }, {
            name: "John",
            price: null
        }, {
            name: "Mark",
            price: null
        }, {
            name: "Tom",
            price: null
        }],
        sellers: [{
            name: "Kate",
            price: 8.9
        }, {
            name: "Alan",
            price: 9.1
        }, {
            name: "Eric",
            price: 7.4
        }, {
            name: "Bob",
            price: null
        }, {
            name: "Amy",
            price: 7.2
        }, {
            name: "Nate",
            price: null
        }, {
            name: "Smith",
            price: null
        }, {
            name: "Dan",
            price: null
        }],
        deals: [{
            buyer: "Louis",
            seller: "Lian",
            price: 7.3
        }, {
            buyer: "Wendy",
            seller: "George",
            price: 6.9
        }]
    }
};
// 'lang' is language pack for the whole page
var langs = {
    en: {
        name: "en",
        head: {
            title: "Round #" + data.round_num + " - Experiment"
        },
        top: {
            title: "Experiment",
            welcome: "Welcome, ",
            progress: [{
                title: "Prepare for Experiment",
                description: "Explain rules / get roles"
            }, {
                title: "Prepare for Round #" + data.round_num,
                description: "Explain round details"
            }, {
                title: "Round #" + data.round_num + " Ongoing",
                description: "Round #" + data.round_num + " is ongoing"
            }, {
                title: "End of Round #" + data.round_num,
                description: "Review results and ranks"
            }, {
                title: "End of Experiment",
                description: "Review results and ranks"
            }]
        },
        card: {
        	by: "by",
        	with: "with",
        	divider: "Your round profit line: "
        }
    },
    cn: {
        name: "cn",
        head: {
            title: "第 " + data.round_num + " 轮 - 实验"
        },
        top: {
            title: "实验",
            welcome: "欢迎，",
            progress: [{
                title: "准备实验",
                description: "解释规则，分配角色"
            }, {
                title: "准备第 " + data.round_num + " 轮交易",
                description: "解释交易规则"
            }, {
                title: "第 " + data.round_num + " 轮交易",
                description: "第 " + data.round_num + " 轮交易进行中"
            }, {
                title: "第 " + data.round_num + " 轮交易结束",
                description: "查看结果与排名"
            }, {
                title: "实验结束",
                description: "查看结果与排名"
            }]
        },
        card: {
        	by: "来自",
        	with: "和",
        	divider: "盈利线: "
        }
    }
}
// 'local' will not be updated with server
var local = {
    my_temp_price: 0,
    current_lang: "en"
};
// ready function
$(document).ready(function() {
    // enabled the popup for profit calculation
    $('.ui.page.dimmer').dimmer({
        closable: false
    });
    // updated page with data
    update(data);
    update_language(langs.en);
});
// update function updates all items with page
var update = function(data) {
    update_user_name(data.user.name);
    update_steps(data.step_num);
    update_round_num(data.round_num);
    set_timer(3000);
    update_profit(data.user.profit);
    update_ranking(data.user.rank);
    reset_my_temp_price();
    update_pendings(data.market, data.user);
    update_done_transactions(data.market, data.user);
    update_b_s_place(data.market, data.user);
    //update_my_temp_price(0);
}
// update the top-right name 
var update_user_name = function(name) {
    $('.user.name').html(name);
}
// update the progress bar on the top, range: 1-5.
var update_steps = function(num) {
    for (var i = 1; i <= 5; i++) {
        $('#step_' + i).removeClass('completed active disabled');
        if (i < num) {
            $('#step_' + i).addClass('completed');
        } else if (i == num) {
            $('#step_' + i).addClass('active');
        } else {
            $('#step_' + i).addClass('disabled');
        };
    };
};
// update the round number
var update_round_num = function(num) {
    $('.round_num').html('#' + num);
};
// set the countdown on the right pannel
var set_timer = function(duration) {
    var timer = duration,
        minutes, seconds;
    var t = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('.countdown').html(minutes + ":" + seconds);
        if (--timer < 0) {
            clearInterval(t);
            round_end();
        };
    }, 1000);
};
// update the profit count on the right pannel
var update_profit = function(profit) {
    if (profit.round == null) {
        r = "N/A";
    } else {
        r = profit.round.toFixed(2);
    };
    if (profit.total == null) {
        t = "N/A";
    } else {
        t = profit.total.toFixed(2);
    };
    $('.user.profit.round').html(r);
    $('.user.profit.total').html(t);
}
// update the ranking info on the right pannel
var update_ranking = function(rank) {
    $('.user.rank.ranking').html(rank.ranking);
    $('.user.rank.ranking_total').html(rank.ranking_total);
};
// reset the temp price box to profit line
var reset_my_temp_price = function() {
    local.my_temp_price = data.user.profit_price;
    update_my_temp_price(0);
    $('.user.profit_price').html(data.user.profit_price);
};
// the response for clicking buttons
var update_my_temp_price = function(offset) {
    local.my_temp_price += offset;
    if (local.my_temp_price < 0) {
        local.my_temp_price = 0;
    };
    $('.my_temp_price').html(local.my_temp_price.toFixed(2));
};
// tirgger when the round countdown to 0
var round_end = function() {
    $('.ui.page.inverted.dimmer').dimmer('toggle');
}
// language package
var update_language = function(lang) {
    local.current_lang = lang.name;
    $('.ui.lang.button').removeClass('active');
    // Head
    $('title').text(lang.head.title);
    // Top
    $('.top.title').text(lang.top.title);
    $('.top.welcome').text(lang.top.welcome);
    for (var i = lang.top.progress.length - 1; i >= 0; i--) {
        $("#step_" + (i + 1) + " .title").text(lang.top.progress[i].title);
        $("#step_" + (i + 1) + " .description").text(lang.top.progress[i].description);
    };
    // End of language rendering
    $('.lang_' + local.current_lang).addClass('active');
    $('.lang_card_divider').text(lang.card.divider);
    $('.lang_card_with').text(lang.card.with);
    $('.lang_card_by').text(lang.card.by);
    $('.lang_card_profit').text(lang.card.profit);
}
// update seller place
var update_b_s_place = function(market, user) {
	var lang_divider = "";
	if (local.current_lang == "en"){
		lang_divider = langs.en.card.divider;
	}else if (local.current_lang == "cn"){
		lang_divider = langs.cn.card.divider;
	}
    var b_str = "<div class=\"ui divider\"></div>";
    var s_str = "<div class=\"ui divider\"></div>";
    var b_str2 = "<div class=\"ui horizontal divider\"><span class=\"lang_card_divider\">" + lang_divider + "</span> $<span class=\"user profit_price\">" + user.profit_price + "</span></div>";
    var s_str2 = "<div class=\"ui horizontal divider\"><span class=\"lang_card_divider\">" + lang_divider + "</span> $<span class=\"user profit_price\">" + user.profit_price + "</span></div>";
    for (var i = market.buyers.length - 1; i >= 0; i--) {
        if (market.buyers[i].price != null) {
            if ((user.type == "seller" && market.buyers[i].price > user.profit_price) || (user.type == "buyer")) {
                b_str += card_generator(user.type, user.profit_price, market.buyers[i], "buyer");
            } else if (user.type == "seller" && market.buyers[i].price <= user.profit_price) {
                b_str2 += card_generator(user.type, user.profit_price, market.buyers[i], "buyer");
            };
        };
    };
    for (var i = market.sellers.length - 1; i >= 0; i--) {
        if (market.sellers[i].price != null) {
            if ((user.type == "buyer" && market.sellers[i].price < user.profit_price) || (user.type == "seller")) {
                s_str += card_generator(user.type, user.profit_price, market.sellers[i], "seller");
            } else if (user.type == "buyer" && market.sellers[i].price >= user.profit_price) {
                s_str2 += card_generator(user.type, user.profit_price, market.sellers[i], "seller");
            };
        };
    };
    if (user.type == "buyer") {
        $('#SellerCards').html(s_str + s_str2);
        $('#BuyerCards').html(b_str);
    } else if (user.type == "seller") {
        $('#SellerCards').html(s_str);
        $('#BuyerCards').html(b_str + b_str2);
    }
    $('.ui.top.attached.button').popup();
}
var update_done_transactions = function(market, user) {
    var str = "";
    for (var i = market.deals.length - 1; i >= 0; i--) {
        str += card_generator(user.type, user.profit_price, market.deals[i], "done");
    };
    $('#DoneTransactionCards').html(str);
}
var update_pendings = function(market, user) {
    var str = "";
    for (var i = market.buyers.length - 1; i >= 0; i--) {
        if (market.buyers[i].price == null) {
            str += card_generator(user.type, user.profit_price, market.buyers[i], "pending");
        }
    };
    for (var i = market.sellers.length - 1; i >= 0; i--) {
        if (market.sellers[i].price == null) {
            str += card_generator(user.type, user.profit_price, market.sellers[i], "pending");
        }
    };
    $('#Pendings').html(str);
}
var card_generator = function(user_type, profit_price, card_info, card_type) {
	var lang_card_generator;
	if (local.current_lang == "en"){
		lang_card_generator = langs.en.card;
	}else if (local.current_lang == "cn"){
		lang_card_generator = langs.cn.card;
	}
    // card_type = "buyer", "seller", "done", "pending"
    // user_type = "buyer", "seller"
    // card_info = {name: "Kate", price: 8.9} OR:
    // card_info = {buyer: "Wendy", seller: "George", price: 6.9}
    var str, color, popup, disabled, price, message;
    if (card_type == "pending") {
        str = "<div class=\"column\"><div class=\"ui fluid card\"><div class=\"content\"><div class=\"description\">";
        str += "<b>" + card_info.name + "</b>";
        str += "</div></div></div></div>";
        return str;
    } else if (card_type == "done") {
        color = "";
        popup = "";
        disabled = "disabled";
        price = card_info.price.toFixed(2);
        message = "<b>" + card_info.buyer + "</b> <span class=\"lang_card_with\">" + lang_card_generator.with + "</span> <b>" + card_info.seller + "</b>";
    } else if (card_type == user_type) {
        color = "";
        popup = "";
        disabled = "disabled";
        price = card_info.price.toFixed(2);
        message = "<span class=\"lang_card_by\">" + lang_card_generator.by + "</span> <b>" + card_info.name + "</b>";
    } else {
        if ((card_info.price > profit_price && user_type == "seller") || (card_info.price < profit_price && user_type == "buyer")) {
            color = "green";
            symbol = "+";
        } else {
            color = "red";
            symbol = "-";
        };
        disabled = "";
        popup = "data-html=\"<div class='ui " + color + " big label'>";
        popup += symbol + " $" + Math.abs(profit_price - card_info.price).toFixed(2); //profit difference
        popup += "</div>\" data-variation=\"huge\"";
        price = card_info.price.toFixed(2);
        message = "<span class=\"lang_card_by\">" + lang_card_generator.by + "</span> <b>" + card_info.name + "</b>";
    };
    str = "<div class=\"column\"><div class=\"ui fluid ";
    str += color; //green / red / 'none'
    str += " card\"><div class=\"ui top attached ";
    str += disabled + color; //disabled / 'none'
    str += " button\"";
    str += popup;
    str += "><h1>$";
    str += price; //price
    str += "</h1></div><div class=\"content\"><div class=\"description\">";
    str += message; // message
    str += "</div></div></div></div>";
    return str;
}