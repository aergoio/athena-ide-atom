-- should redeploy to a 'redeploy-before' add 'new' function

function legacy()
  return "legacy"
end

function new()
  return "new"
end

abi.register_view(legacy, new)
