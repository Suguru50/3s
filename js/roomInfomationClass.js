var Map = function()
{
    this.data_ = function(){}
}

Map.prototype =
{
    data_ : null,
    use_prototype_ : false,
    prototype_value_ : undefined,

    // 要素を空にする
    clear : function()
    {
        this.data_ = function(){}
        this.use_prototype_ = false;
    },

    // 指定のキーのデータを持っているならtrue
    contains : function(key)
    {
        return key == "prototype" ? this.use_prototype_ : key in this.data_;
    },

    // 値を保持する
    put : function(key, value)
    {
        if (key == "prototype") {
            this.use_prototype_ = true;
            this.prototype_value_ = value;
        } else {
            this.data_[key] = value;
        }
    },

    // 指定のキーに割り当てられている値を取得する
    get : function(key)
    {
        return key == "prototype" ? this.prototype_value_ : this.data_[key];
    },

    // データの個数を返す。
    get size()
    {
        var n = this.use_prototype_ ? 1 : 0;

        for (var key in this.data_) {
            if (key != "prototype")
                n = n + 1;
        }

        return n;
    },

}
